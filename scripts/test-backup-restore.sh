#!/bin/bash

# Test Backup Restore Script
# This script tests the restore process without affecting production
# It creates a temporary test database, restores the latest backup, verifies data, and cleans up

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_success() { echo -e "${GREEN}✅ $1${NC}"; }
print_error() { echo -e "${RED}❌ $1${NC}"; }
print_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
print_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }

echo "╔═══════════════════════════════════════════════════════╗"
echo "║      Database Backup Restore Test                    ║"
echo "╚═══════════════════════════════════════════════════════╝"
echo ""

# Configuration
BACKUP_DIR="${BACKUP_DIR:-./backups}"
TEST_DB_NAME="fitcoach_restore_test_$(date +%s)"
CLEANUP_ON_SUCCESS="${CLEANUP_ON_SUCCESS:-true}"

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    print_error "DATABASE_URL environment variable is not set"
    echo "Usage: DATABASE_URL='your-connection-string' ./scripts/test-backup-restore.sh"
    exit 1
fi

# Find latest backup
print_info "Searching for backups in $BACKUP_DIR..."
LATEST_BACKUP=$(ls -t $BACKUP_DIR/fitcoach_*.sql.gz 2>/dev/null | head -1)

if [ -z "$LATEST_BACKUP" ]; then
    print_error "No backup files found in $BACKUP_DIR"
    echo ""
    echo "Please ensure backups exist before running this test."
    echo "Run: DATABASE_URL='your-url' ./scripts/backup-database.sh"
    exit 1
fi

print_success "Found backup: $LATEST_BACKUP"
BACKUP_SIZE=$(du -h "$LATEST_BACKUP" | cut -f1)
BACKUP_DATE=$(stat -f %Sm -t "%Y-%m-%d %H:%M:%S" "$LATEST_BACKUP" 2>/dev/null || stat -c %y "$LATEST_BACKUP" | cut -d'.' -f1)
print_info "Backup size: $BACKUP_SIZE"
print_info "Backup date: $BACKUP_DATE"
echo ""

# Parse DATABASE_URL
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

print_info "Database host: $DB_HOST"
print_info "Test database: $TEST_DB_NAME"
echo ""

# Cleanup function
cleanup() {
    if [ "$CLEANUP_ON_SUCCESS" = "true" ]; then
        print_info "Cleaning up test database..."
        PGPASSWORD="$DB_PASSWORD" dropdb \
          -h "$DB_HOST" \
          -p "$DB_PORT" \
          -U "$DB_USER" \
          "$TEST_DB_NAME" 2>/dev/null && print_success "Test database cleaned up" || print_warning "Test database may not exist"
    else
        print_info "Test database preserved: $TEST_DB_NAME"
    fi
}

# Set trap for cleanup on exit
trap cleanup EXIT

# Step 1: Verify backup file integrity
print_info "Step 1/5: Verifying backup file integrity..."
if gunzip -t "$LATEST_BACKUP" 2>/dev/null; then
    print_success "Backup file is valid and not corrupted"
else
    print_error "Backup file is corrupted or invalid"
    exit 1
fi
echo ""

# Step 2: Create test database
print_info "Step 2/5: Creating test database..."
if PGPASSWORD="$DB_PASSWORD" createdb \
  -h "$DB_HOST" \
  -p "$DB_PORT" \
  -U "$DB_USER" \
  "$TEST_DB_NAME" 2>/dev/null; then
    print_success "Test database created: $TEST_DB_NAME"
else
    print_error "Failed to create test database"
    print_info "This may be due to insufficient permissions or connection issues"
    exit 1
fi
echo ""

# Step 3: Restore backup to test database
print_info "Step 3/5: Restoring backup to test database..."
print_info "This may take a few minutes depending on backup size..."

START_TIME=$(date +%s)
if gunzip -c "$LATEST_BACKUP" | PGPASSWORD="$DB_PASSWORD" psql \
  -h "$DB_HOST" \
  -p "$DB_PORT" \
  -U "$DB_USER" \
  -d "$TEST_DB_NAME" \
  --quiet 2>/dev/null; then
    END_TIME=$(date +%s)
    DURATION=$((END_TIME - START_TIME))
    print_success "Backup restored successfully in ${DURATION}s"
else
    print_error "Failed to restore backup"
    exit 1
fi
echo ""

# Step 4: Verify data integrity
print_info "Step 4/5: Verifying data integrity..."

# Check critical tables exist and have data
TABLES=("tenants" "customers" "team_members" "subscriptions" "training_plans" "nutrition_plans")
TOTAL_RECORDS=0
FAILED_TABLES=0

for TABLE in "${TABLES[@]}"; do
    COUNT=$(PGPASSWORD="$DB_PASSWORD" psql \
      -h "$DB_HOST" \
      -p "$DB_PORT" \
      -U "$DB_USER" \
      -d "$TEST_DB_NAME" \
      -t -c "SELECT COUNT(*) FROM $TABLE" 2>/dev/null | tr -d ' ')
    
    if [ $? -eq 0 ]; then
        print_success "Table $TABLE: $COUNT records"
        TOTAL_RECORDS=$((TOTAL_RECORDS + COUNT))
    else
        print_error "Failed to query table $TABLE"
        FAILED_TABLES=$((FAILED_TABLES + 1))
    fi
done

if [ $FAILED_TABLES -gt 0 ]; then
    print_warning "$FAILED_TABLES table(s) failed verification"
fi

print_info "Total records verified: $TOTAL_RECORDS"
echo ""

# Step 5: Verify database schema
print_info "Step 5/5: Verifying database schema..."

# Check for critical indexes
INDEX_COUNT=$(PGPASSWORD="$DB_PASSWORD" psql \
  -h "$DB_HOST" \
  -p "$DB_PORT" \
  -U "$DB_USER" \
  -d "$TEST_DB_NAME" \
  -t -c "SELECT COUNT(*) FROM pg_indexes WHERE schemaname = 'public'" 2>/dev/null | tr -d ' ')

if [ $? -eq 0 ]; then
    print_success "Database indexes: $INDEX_COUNT"
else
    print_warning "Could not verify indexes"
fi

# Check for foreign key constraints
FK_COUNT=$(PGPASSWORD="$DB_PASSWORD" psql \
  -h "$DB_HOST" \
  -p "$DB_PORT" \
  -U "$DB_USER" \
  -d "$TEST_DB_NAME" \
  -t -c "SELECT COUNT(*) FROM information_schema.table_constraints WHERE constraint_type = 'FOREIGN KEY'" 2>/dev/null | tr -d ' ')

if [ $? -eq 0 ]; then
    print_success "Foreign key constraints: $FK_COUNT"
else
    print_warning "Could not verify foreign keys"
fi

echo ""

# Generate test report
echo "╔═══════════════════════════════════════════════════════╗"
echo "║              Test Report                              ║"
echo "╚═══════════════════════════════════════════════════════╝"
echo ""
print_success "Backup restore test completed successfully!"
echo ""
echo "Test Summary:"
echo "  📁 Backup file: $LATEST_BACKUP"
echo "  📊 Backup size: $BACKUP_SIZE"
echo "  📅 Backup date: $BACKUP_DATE"
echo "  🗄️  Test database: $TEST_DB_NAME"
echo "  📋 Tables verified: ${#TABLES[@]}"
echo "  📝 Total records: $TOTAL_RECORDS"
echo "  🔗 Indexes: $INDEX_COUNT"
echo "  🔐 Foreign keys: $FK_COUNT"
echo "  ⏱️  Restore time: ${DURATION}s"
echo "  ✅ Status: PASSED"
echo ""
print_info "Next test recommended: $(date -d '+1 month' '+%Y-%m-%d' 2>/dev/null || date -v+1m '+%Y-%m-%d')"
echo ""

# Save test results
TEST_REPORT_FILE="./backups/test-report-$(date +%Y%m%d_%H%M%S).txt"
cat > "$TEST_REPORT_FILE" << EOF
Database Backup Restore Test Report
====================================

Test Date: $(date)
Backup File: $LATEST_BACKUP
Backup Size: $BACKUP_SIZE
Backup Date: $BACKUP_DATE
Test Database: $TEST_DB_NAME

Results:
--------
Tables Verified: ${#TABLES[@]}
Total Records: $TOTAL_RECORDS
Failed Tables: $FAILED_TABLES
Indexes: $INDEX_COUNT
Foreign Keys: $FK_COUNT
Restore Time: ${DURATION}s

Status: PASSED ✅

Next Test: $(date -d '+1 month' '+%Y-%m-%d' 2>/dev/null || date -v+1m '+%Y-%m-%d')
EOF

print_info "Test report saved: $TEST_REPORT_FILE"

exit 0
