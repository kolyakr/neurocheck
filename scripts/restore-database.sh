#!/bin/bash

echo "🔄 Restoring MySQL database from backup..."

# Check if backup file is provided
if [ -z "$1" ]; then
    echo "❌ Please provide a backup file path"
    echo "Usage: $0 <backup_file_path>"
    echo ""
    echo "📋 Available backups:"
    ls -la database/backups/backup_*.sql 2>/dev/null || echo "   No backups found"
    exit 1
fi

BACKUP_FILE="$1"

# Check if backup file exists
if [ ! -f "$BACKUP_FILE" ]; then
    echo "❌ Backup file not found: $BACKUP_FILE"
    exit 1
fi

# Check if database is running
if ! docker exec neurocheck-mysql mysqladmin ping -h localhost -u neurocheck_user -pneurocheck_password_2024 > /dev/null 2>&1; then
    echo "❌ Database is not running. Please start it first with: npm run db:start"
    exit 1
fi

echo "⚠️  WARNING: This will replace all current data in the database!"
read -p "Are you sure you want to continue? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Restore cancelled"
    exit 1
fi

# Create a backup of current state before restore
echo "💾 Creating safety backup before restore..."
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
SAFETY_BACKUP="database/backups/safety_backup_${TIMESTAMP}.sql"
docker exec neurocheck-mysql mysqldump -u neurocheck_user -pneurocheck_password_2024 neurocheck > "$SAFETY_BACKUP"

# Restore from backup
echo "🔄 Restoring from backup: $BACKUP_FILE"
docker exec -i neurocheck-mysql mysql -u neurocheck_user -pneurocheck_password_2024 neurocheck < "$BACKUP_FILE"

if [ $? -eq 0 ]; then
    echo "✅ Database restored successfully!"
    echo "💾 Safety backup created: $SAFETY_BACKUP"
    
    # Generate Prisma client to ensure it's up to date
    echo "🔧 Regenerating Prisma client..."
    npx prisma generate
    
    echo "🎉 Restore complete!"
else
    echo "❌ Restore failed!"
    echo "💾 You can restore from the safety backup: $SAFETY_BACKUP"
    exit 1
fi
