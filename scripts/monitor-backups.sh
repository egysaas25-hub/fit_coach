#!/bin/bash

# Backup Monitoring Script
# Checks backup health and sends alerts if issues detected
# Run this script regularly (e.g., hourly) to monitor backup status

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_success() { echo -e "${GREEN}✅ $1${NC}"; }
print_error() { echo -e "${RED}❌ $1${NC}"; }
print_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
print_info() { echo -e "${YELLOW}ℹ️  $1${NC}"; }

# Configuration
BACKUP_DIR="${BACKUP_DIR:-./backups}"
MAX_AGE_HOURS="${MAX_AGE_HOURS:-26}"  # Alert if no backup in 26 hours (daily + buffer)
MIN_SIZE_MB="${MIN_SIZE_MB:-10}"      # Alert if backup smaller than 10MB
ALERT_EMAIL="${ALERT_EMAIL:-}"
SLACK_WEBHOOK="${SLACK_WEBHOOK:-}"

# Exit codes
EXIT_SUCCESS=0
EXIT_NO_BACKUPS=1
EXIT_BACKUP_TOO_OLD=2
EXIT_BACKUP_TOO_SMALL=3
EXIT_BACKUP_CORRUPTED=4

# Alert function
send_alert() {
    local SEVERITY=$1
    local MESSAGE=$2
    
    echo "$MESSAGE"
    
    # Send email alert if configured
    if [ -n "$ALERT_EMAIL" ]; then
        echo "$MESSAGE" | mail -s "[$SEVERITY] Database Backup Alert" "$ALERT_EMAIL" 2>/dev/null || true
    fi
    
    # Send Slack alert if configured
    if [ -n "$SLACK_WEBHOOK" ]; then
        local EMOJI="🚨"
        [ "$SEVERITY" = "WARNING" ] && EMOJI="⚠️"
        [ "$SEVERITY" = "INFO" ] && EMOJI="ℹ️"
        
        curl -X POST "$SLACK_WEBHOOK" \
          -H 'Content-Type: application/json' \
          -d "{\"text\": \"$EMOJI [$SEVERITY] Database Backup Alert: $MESSAGE\"}" \
          2>/dev/null || true
    fi
}

echo "╔═══════════════════════════════════════════════════════╗"
echo "║         Database Backup Monitor                       ║"
echo "╚═══════════════════════════════════════════════════════╝"
echo ""
print_info "Monitoring backups in: $BACKUP_DIR"
print_info "Check time: $(date)"
echo ""

# Check 1: Verify backup directory exists
if [ ! -d "$BACKUP_DIR" ]; then
    print_error "Backup directory does not exist: $BACKUP_DIR"
    send_alert "CRITICAL" "Backup directory not found: $BACKUP_DIR"
    exit $EXIT_NO_BACKUPS
fi

# Check 2: Find latest backup
LATEST_BACKUP=$(ls -t $BACKUP_DIR/fitcoach_*.sql.gz 2>/dev/null | head -1)

if [ -z "$LATEST_BACKUP" ]; then
    print_error "No backup files found in $BACKUP_DIR"
    send_alert "CRITICAL" "No backup files found in $BACKUP_DIR"
    exit $EXIT_NO_BACKUPS
fi

print_success "Latest backup found: $(basename $LATEST_BACKUP)"

# Check 3: Verify backup age
CURRENT_TIME=$(date +%s)
BACKUP_TIME=$(stat -f %m "$LATEST_BACKUP" 2>/dev/null || stat -c %Y "$LATEST_BACKUP")
BACKUP_AGE_SECONDS=$((CURRENT_TIME - BACKUP_TIME))
BACKUP_AGE_HOURS=$((BACKUP_AGE_SECONDS / 3600))
BACKUP_AGE_MINUTES=$(((BACKUP_AGE_SECONDS % 3600) / 60))

print_info "Backup age: ${BACKUP_AGE_HOURS}h ${BACKUP_AGE_MINUTES}m"

if [ $BACKUP_AGE_HOURS -gt $MAX_AGE_HOURS ]; then
    print_error "Backup is too old: ${BACKUP_AGE_HOURS}h (threshold: ${MAX_AGE_HOURS}h)"
    send_alert "CRITICAL" "Latest backup is ${BACKUP_AGE_HOURS} hours old (threshold: ${MAX_AGE_HOURS}h). Backup may have failed."
    exit $EXIT_BACKUP_TOO_OLD
else
    print_success "Backup age is acceptable (< ${MAX_AGE_HOURS}h)"
fi

# Check 4: Verify backup size
BACKUP_SIZE_BYTES=$(stat -f %z "$LATEST_BACKUP" 2>/dev/null || stat -c %s "$LATEST_BACKUP")
BACKUP_SIZE_MB=$((BACKUP_SIZE_BYTES / 1024 / 1024))
BACKUP_SIZE_HUMAN=$(du -h "$LATEST_BACKUP" | cut -f1)

print_info "Backup size: $BACKUP_SIZE_HUMAN (${BACKUP_SIZE_MB}MB)"

if [ $BACKUP_SIZE_MB -lt $MIN_SIZE_MB ]; then
    print_error "Backup is too small: ${BACKUP_SIZE_MB}MB (threshold: ${MIN_SIZE_MB}MB)"
    send_alert "CRITICAL" "Latest backup is only ${BACKUP_SIZE_MB}MB (threshold: ${MIN_SIZE_MB}MB). Backup may be incomplete."
    exit $EXIT_BACKUP_TOO_SMALL
else
    print_success "Backup size is acceptable (> ${MIN_SIZE_MB}MB)"
fi

# Check 5: Verify backup integrity
print_info "Checking backup file integrity..."
if gunzip -t "$LATEST_BACKUP" 2>/dev/null; then
    print_success "Backup file integrity verified"
else
    print_error "Backup file is corrupted"
    send_alert "CRITICAL" "Latest backup file is corrupted and cannot be restored: $LATEST_BACKUP"
    exit $EXIT_BACKUP_CORRUPTED
fi

# Check 6: Count total backups
TOTAL_BACKUPS=$(ls -1 $BACKUP_DIR/fitcoach_*.sql.gz 2>/dev/null | wc -l | tr -d ' ')
print_info "Total backups: $TOTAL_BACKUPS"

if [ $TOTAL_BACKUPS -lt 7 ]; then
    print_warning "Less than 7 backups available (found: $TOTAL_BACKUPS)"
    send_alert "WARNING" "Only $TOTAL_BACKUPS backup(s) available. Recommend maintaining at least 7 days of backups."
fi

# Check 7: Calculate total backup storage
TOTAL_SIZE=$(du -sh $BACKUP_DIR 2>/dev/null | cut -f1)
print_info "Total backup storage: $TOTAL_SIZE"

# Check 8: Verify backup retention
OLDEST_BACKUP=$(ls -t $BACKUP_DIR/fitcoach_*.sql.gz 2>/dev/null | tail -1)
if [ -n "$OLDEST_BACKUP" ]; then
    OLDEST_TIME=$(stat -f %m "$OLDEST_BACKUP" 2>/dev/null || stat -c %Y "$OLDEST_BACKUP")
    OLDEST_AGE_DAYS=$(((CURRENT_TIME - OLDEST_TIME) / 86400))
    print_info "Oldest backup age: ${OLDEST_AGE_DAYS} days"
    
    if [ $OLDEST_AGE_DAYS -lt 30 ]; then
        print_warning "Oldest backup is only ${OLDEST_AGE_DAYS} days old (recommend: 30+ days)"
    else
        print_success "Backup retention meets 30-day requirement"
    fi
fi

# Summary
echo ""
echo "╔═══════════════════════════════════════════════════════╗"
echo "║              Health Check Summary                     ║"
echo "╚═══════════════════════════════════════════════════════╝"
echo ""
print_success "All backup health checks passed!"
echo ""
echo "Backup Status:"
echo "  📁 Latest backup: $(basename $LATEST_BACKUP)"
echo "  📊 Size: $BACKUP_SIZE_HUMAN"
echo "  ⏰ Age: ${BACKUP_AGE_HOURS}h ${BACKUP_AGE_MINUTES}m"
echo "  💾 Total backups: $TOTAL_BACKUPS"
echo "  📦 Total storage: $TOTAL_SIZE"
echo "  ✅ Status: HEALTHY"
echo ""

# List recent backups
echo "Recent backups:"
ls -lh $BACKUP_DIR/fitcoach_*.sql.gz 2>/dev/null | tail -5 | awk '{
    size = $5
    date = $6 " " $7 " " $8
    file = $9
    gsub(/.*\//, "", file)
    printf "  %s - %s (%s)\n", date, file, size
}'

echo ""
print_info "Next check: $(date -d '+1 hour' '+%Y-%m-%d %H:%M' 2>/dev/null || date -v+1H '+%Y-%m-%d %H:%M')"

exit $EXIT_SUCCESS
