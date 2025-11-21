#!/bin/bash

# Production Database Restore Script
# This script restores a database from a backup file

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

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

# Check if backup file is provided
if [ -z "$1" ]; then
    print_error "No backup file specified"
    echo ""
    echo "Usage: DATABASE_URL='your-connection-string' ./scripts/restore-database.sh <backup-file>"
    echo ""
    echo "Example:"
    echo "  ./scripts/restore-database.sh ./backups/fitcoach_20251121_120000.sql.gz"
    echo ""
    echo "Available backups:"
    ls -lh ./backups/fitcoach_*.sql.gz 2>/dev/null | tail -5 | awk '{print "  " $9 " (" $5 ")"}'
    exit 1
fi

BACKUP_FILE="$1"

# Check if backup file exists
if [ ! -f "$BACKUP_FILE" ]; then
    print_error "Backup file not found: $BACKUP_FILE"
    exit 1
fi

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    print_error "DATABASE_URL environment variable is not set"
    echo "Usage: DATABASE_URL='your-connection-string' ./scripts/restore-database.sh <backup-file>"
    exit 1
fi

# Parse DATABASE_URL to extract components
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

# Display warning
echo "╔═══════════════════════════════════════════════════════╗"
echo "║         Database Restore Tool                         ║"
echo "╚═══════════════════════════════════════════════════════╝"
echo ""
print_warning "WARNING: This will REPLACE all data in the database!"
print_info "Database: $DB_NAME"
print_info "Host: $DB_HOST"
print_info "Backup file: $BACKUP_FILE"
BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
print_info "Backup size: $BACKUP_SIZE"
echo ""

# Confirmation prompt
read -p "Are you sure you want to restore? Type 'yes' to continue: " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
    print_info "Restore cancelled"
    exit 0
fi

echo ""
print_info "Starting restore at $(date)"

# Perform restore
gunzip -c "$BACKUP_FILE" | PGPASSWORD="$DB_PASSWORD" psql \
  -h "$DB_HOST" \
  -p "$DB_PORT" \
  -U "$DB_USER" \
  -d "$DB_NAME" \
  --quiet

# Check if restore was successful
if [ $? -eq 0 ]; then
    echo ""
    print_success "Restore completed successfully"
    print_info "Completed at $(date)"
    echo ""
    print_info "Next steps:"
    echo "   1. Verify data integrity"
    echo "   2. Run migrations if needed: npx prisma migrate deploy"
    echo "   3. Test application functionality"
    echo "   4. Check logs for any errors"
    exit 0
else
    echo ""
    print_error "Restore failed"
    echo ""
    echo "Troubleshooting:"
    echo "1. Check DATABASE_URL is correct"
    echo "2. Verify psql is installed: psql --version"
    echo "3. Check database connectivity: psql \"\$DATABASE_URL\" -c 'SELECT 1'"
    echo "4. Verify backup file is not corrupted: gunzip -t $BACKUP_FILE"
    echo "5. Check user has restore permissions"
    exit 1
fi
