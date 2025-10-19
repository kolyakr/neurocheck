#!/bin/bash

echo "🚀 Setting up Neurocheck MySQL Database..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Start database services
echo "📦 Starting MySQL database..."
docker-compose up -d mysql

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 15

# Check if database is accessible
if docker exec neurocheck-mysql mysqladmin ping -h localhost -u neurocheck_user -pneurocheck_password_2024 > /dev/null 2>&1; then
    echo "✅ Database is ready!"
    
    # Generate Prisma client
    echo "🔧 Generating Prisma client..."
    npx prisma generate
    
    # Push schema to database
    echo "📊 Pushing schema to database..."
    npx prisma db push
    
    # Seed database
    echo "🌱 Seeding database..."
    npm run db:seed
    
    echo "🎉 Database setup complete!"
    echo ""
    echo "📋 Next steps:"
    echo "   - Run 'npm run dev' to start the development server"
    echo "   - Run 'npm run db:studio' to open Prisma Studio"
    echo "   - Check your .env file for DATABASE_URL"
    echo ""
    echo "🔗 Database connection:"
    echo "   Host: localhost"
    echo "   Port: 3306"
    echo "   Database: neurocheck"
    echo "   Username: neurocheck_user"
    echo "   Password: neurocheck_password_2024"
else
    echo "❌ Database setup failed!"
    echo "📋 Troubleshooting:"
    echo "   - Check Docker logs: docker-compose logs mysql"
    echo "   - Restart database: docker-compose restart mysql"
    echo "   - Reset database: npm run db:reset"
    exit 1
fi
