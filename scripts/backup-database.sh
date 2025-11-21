#!/bin/bash

# Production Database Backup Script
# This script creates a compressed backup of the PostgreSQL database

# Configuration
BACKUP_DIR="${BACKUP_DIR:-./backups}"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/fitcoach_$DATE.sql.gz"
RETENTION_DAYS="${RETENTION_DAYS:-30}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    print_error "DATABASE_URL environment variable is not set"
    echo "Usage: DATABASE_URL='your-connection-string' ./scripts/backup-database.sh"
    exit 1
fi

# Parse DATABASE_URL to extract components
# Format: postgresql://user:password@host:port/database
DB_URL_REGEX="postgresql://([^:]+):([^@]+)@([^:]+):([^/]+)/([^?]+)"

if [[ $DATABASE_URL =~ $DB_URL_REGEX ]]; then
    DB_USER="${BASH_REMATCH[1]}"
    DB_PASSWORD="${BASH_REMATCH[2]}"
    DB_HOST="${BASH_REMATCH[3]}"
    DB_PORT="${BASH_REMATCH[4]}"
    DB_NAME="${BASH_REMATCH[5]}"
else
    print_error "Could not parse DATABASE_URL"
    exit 1
fi

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Start backup
echo "╔═══════════════════════════════════════════════════════╗"
echo "║         Database Backup Tool                          ║"
echo "╚═══════════════════════════════════════════════════════╝"
echo ""
print_info "Starting backup at $(date)"
print_info "Database: $DB_NAME"
print_info "Host: $DB_HOST"
print_info "Backup file: $BACKUP_FILE"
echo ""

# Perform backup
PGPASSWORD="$DB_PASSWORD" pg_dump \
  -h "$DB_HOST" \
  -p "$DB_PORT" \
  -U "$DB_USER" \
  -d "$DB_NAME" \
  --no-owner \
  --no-acl \
  --clean \
  --if-exists \
  | gzip > "$BACKUP_FILE"

# Check if backup was successful
if [ $? -eq 0 ]; then
    BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
    print_success "Backup completed successfully"
    print_info "Backup size: $BACKUP_SIZE"
    print_info "Location: $BACKUP_FILE"
    echo ""
    
    # Clean up old backups
    print_info "Cleaning up backups older than $RETENTION_DAYS days..."
    DELETED_COUNT=$(find "$BACKUP_DIR" -name "fitcoach_*.sql.gz" -mtime +$RETENTION_DAYS -delete -print | wc -l)
    
    if [ "$DELETED_COUNT" -gt 0 ]; then
        print_success "Deleted $DELETED_COUNT old backup(s)"
    else
        print_info "No old backups to delete"
    fi
    
    # List recent backups
    echo ""
    print_info "Recent backups:"
    ls -lh "$BACKUP_DIR"/fitcoach_*.sql.gz | tail -5 | awk '{print "   " $9 " (" $5 ")"}'
    
    echo ""
    print_success "Backup process completed"
    exit 0
else
    print_error "Backup failed"
    echo ""
    echo "Troubleshooting:"
    echo "1. Check DATABASE_URL is correct"
    echo "2. Verify pg_dump is installed: pg_dump --version"
    echo "3. Check database connectivity: psql \"\$DATABASE_URL\" -c 'SELECT 1'"
    echo "4. Verify user has backup permissions"
    exit 1
fi
