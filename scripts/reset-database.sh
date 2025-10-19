#!/bin/bash

echo "🔄 Resetting Neurocheck MySQL Database..."

# Stop services
echo "🛑 Stopping database services..."
docker-compose down

# Remove volumes (this deletes all data)
echo "🗑️ Removing database volumes..."
docker-compose down -v

# Start services again
echo "🚀 Starting fresh MySQL database..."
docker-compose up -d mysql

# Wait for database to be ready
echo "⏳ Waiting for database to initialize..."
sleep 20

# Check if database is accessible
if docker exec neurocheck-mysql mysqladmin ping -h localhost -u neurocheck_user -pneurocheck_password_2024 > /dev/null 2>&1; then
    echo "✅ Fresh database is ready!"
    
    # Generate Prisma client
    echo "🔧 Generating Prisma client..."
    npx prisma generate
    
    # Push schema to database
    echo "📊 Pushing schema to database..."
    npx prisma db push
    
    # Seed database
    echo "🌱 Seeding database..."
    npm run db:seed
    
    echo "🎉 Database reset complete!"
else
    echo "❌ Database reset failed!"
    echo "📋 Troubleshooting:"
    echo "   - Check Docker logs: docker-compose logs mysql"
    echo "   - Try manual reset: docker-compose down -v && docker-compose up -d mysql"
    exit 1
fi
