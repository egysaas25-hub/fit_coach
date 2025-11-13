#!/bin/bash

# Script to test all routes for FitCoach Pro frontend
# Runs on localhost:3001, logs results to route-test.log

# Configuration
BASE_URL="http://localhost:3000"
LOG_FILE="route-test.log"
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
FAILED_ROUTES=()

# Clear previous log
> "$LOG_FILE"

# List of 48 unique routes to test
ROUTES=(
    "/super-admin/analytics"
    "/super-admin/billing"
    "/super-admin/config"
    "/super-admin/tenants"
    "/super-admin/tenants/[id]"
    "/super-admin/dashboard"
    "/super-admin/settings"
    "/super-admin/etl"
    "/super-admin/dispatch"
    "/super-admin/webhooks"
    "/super-admin/integrations"
    "/super-admin/embeddings"
    "/super-admin/dictionary"
    "/super-admin/translations"
    "/super-admin/rate-limits"
    "/super-admin/tools"
    "/super-admin/backup"
    "/super-admin/api/docs"
    "/admin/ai/logs"
    "/admin/ai/templates"
    "/admin/analytics/global"
    "/admin/audit"
    "/admin/errors"
    "/admin/permissions"
    "/admin/referrals"
    "/admin/reports"
    "/admin/roles"
    "/admin/system"
    "/admin/teams/dashboard"
    "/admin/users"
    "/admin/dashboard"
    "/admin/customers"
    "/admin/subscriptions"
    "/admin/message-templates"
    "/admin/conversations"
    "/admin/integrations"
    "/admin/settings"
    "/admin/notifications"
    "/admin/support"
    "/trainer/clients"
    "/trainer/dashboard"
    "/trainer/login"
    "/trainer/meal-plans"
    "/trainer/profile"
    "/trainer/progress-templates"
    "/trainer/register"
    "/trainer/questions"
    "/trainer/schedule"
    "/trainer/reports"
    "/activity"
    "/analytics"
    "/api-monitoring"
    "/appointments"
    "/billing"
    "/consultations"
    "/forgot-password"
    "/login"
    "/messaging"
    "/nutrition"
    "/profile"
    "/progress-photos"
    "/register"
    "/sessions"
    "/settings"
    "/support"
    "/client/activity"
    "/client/calendar"
    "/client/dashboard"
    "/client/goals"
    "/client/logs/workout"
    "/client/progress/measurements"
    "/client/progress/photos"
    "/client/progress/weight"
    "/messages"
    "/subscriptions"
    "/payment"
    "/questions"
    "/notifications"
    "/feedback"
    "/history"
    "/client/progress-tracking"
    "/client/onboarding"
)

# Function to test a route and log result
test_route() {
    local route=$1
    local full_url="${BASE_URL}${route}"
    echo "Testing $full_url..." >&2
    response=$(curl -s -o /dev/null -w "%{http_code}" "$full_url")

    if [ "$response" -ge 200 ] && [ "$response" -lt 400 ]; then
        echo "[$TIMESTAMP] $full_url - Status: $response (SUCCESS)" >> "$LOG_FILE"
    else
        echo "[$TIMESTAMP] $full_url - Status: $response (FAILED)" >> "$LOG_FILE"
        FAILED_ROUTES+=("$full_url")
    fi
}

# Test all routes
echo "Starting route tests at $TIMESTAMP" > "$LOG_FILE"
for route in "${ROUTES[@]}"; do
    test_route "$route"
done

# Summary
echo "----------------------------------------" >> "$LOG_FILE"
echo "Test Summary:" >> "$LOG_FILE"
echo "Total routes tested: ${#ROUTES[@]}" >> "$LOG_FILE"
echo "Failed routes: ${#FAILED_ROUTES[@]}" >> "$LOG_FILE"

if [ ${#FAILED_ROUTES[@]} -eq 0 ]; then
    echo "All routes passed!" >> "$LOG_FILE"
else
    echo "Failed routes:" >> "$LOG_FILE"
    for failed in "${FAILED_ROUTES[@]}"; do
        echo "  - $failed" >> "$LOG_FILE"
    done
fi

echo "Test completed. Check $LOG_FILE for details."
cat "$LOG_FILE"