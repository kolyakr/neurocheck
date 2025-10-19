#!/bin/bash

# Create backups directory if it doesn't exist
mkdir -p database/backups

# Generate timestamp for backup filename
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="database/backups/backup_${TIMESTAMP}.sql"

echo "💾 Creating MySQL database backup..."

# Check if database is running
if ! docker exec neurocheck-mysql mysqladmin ping -h localhost -u neurocheck_user -pneurocheck_password_2024 > /dev/null 2>&1; then
    echo "❌ Database is not running. Please start it first with: npm run db:start"
    exit 1
fi

# Create backup
docker exec neurocheck-mysql mysqldump -u neurocheck_user -pneurocheck_password_2024 neurocheck > "$BACKUP_FILE"

if [ $? -eq 0 ]; then
    echo "✅ Backup created successfully: $BACKUP_FILE"
    
    # Show backup file size
    BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
    echo "📊 Backup size: $BACKUP_SIZE"
    
    # List recent backups
    echo "📋 Recent backups:"
    ls -la database/backups/backup_*.sql 2>/dev/null | tail -5 || echo "   No previous backups found"
else
    echo "❌ Backup failed!"
    exit 1
fi
