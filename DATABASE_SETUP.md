# Neurocheck MySQL Database Setup

This guide will help you set up the MySQL database for the Neurocheck application using Docker and Prisma.

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env` file in the root directory with:

```env
DATABASE_URL="mysql://neurocheck_user:neurocheck_password_2024@localhost:3306/neurocheck"
NEXTAUTH_SECRET="neurocheck_secret_key_2024_development"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Complete Database Setup

```bash
npm run db:setup
```

This command will:

- Start MySQL in Docker
- Generate Prisma client
- Push schema to database
- Seed with sample data

## Available Commands

### Database Management

```bash
# Start database
npm run db:start

# Stop database
npm run db:stop

# Reset database (removes all data)
npm run db:reset

# Complete reset with re-seeding
npm run db:reset-full
```

### Prisma Operations

```bash
# Generate Prisma client
npm run db:generate

# Push schema changes to database
npm run db:push

# Create and run migrations
npm run db:migrate

# Seed database with sample data
npm run db:seed

# Open Prisma Studio (database GUI)
npm run db:studio
```

### Backup & Restore

```bash
# Create backup
npm run db:backup

# Create backup using script
npm run db:backup-script

# Restore from backup
npm run db:restore-script database/backups/backup_20241201_120000.sql
```

## Database Schema

The database includes the following tables:

- **users** - User accounts and authentication
- **diagnosis_sessions** - Diagnosis questionnaire responses and results
- **chat_messages** - AI chat conversations
- **user_preferences** - User settings and preferences
- **system_logs** - Application logs and audit trail

## Sample Data

The seed script creates:

- 2 test users (`test@example.com` and `demo@neurocheck.com`)
- 5 diagnosis sessions with different outcomes
- Chat messages demonstrating AI interactions
- User preferences and system logs

## Database Connection Details

- **Host**: localhost
- **Port**: 3306
- **Database**: neurocheck
- **Username**: neurocheck_user
- **Password**: neurocheck_password_2024

## Troubleshooting

### Database Won't Start

```bash
# Check Docker status
docker --version
docker-compose --version

# Check container logs
docker-compose logs mysql

# Restart database
docker-compose restart mysql
```

### Connection Issues

```bash
# Test database connection
docker exec neurocheck-mysql mysqladmin ping -h localhost -u neurocheck_user -pneurocheck_password_2024

# Connect to database directly
docker exec -it neurocheck-mysql mysql -u neurocheck_user -pneurocheck_password_2024 neurocheck
```

### Reset Everything

```bash
# Complete reset (removes all data)
npm run db:reset-full
```

## Development Workflow

1. **Start development**: `npm run dev`
2. **Database changes**: Update `prisma/schema.prisma`
3. **Apply changes**: `npm run db:push`
4. **View data**: `npm run db:studio`
5. **Backup**: `npm run db:backup-script`

## Production Considerations

For production deployment:

- Use environment variables for all sensitive data
- Set up proper backup schedules
- Configure database monitoring
- Use connection pooling
- Enable SSL connections

## File Structure

```
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts               # Sample data
├── scripts/
│   ├── setup-database.sh    # Complete setup
│   ├── reset-database.sh    # Reset with re-seeding
│   ├── backup-database.sh   # Create backups
│   └── restore-database.sh  # Restore from backup
├── src/shared/lib/
│   ├── prisma.ts           # Prisma client
│   └── database-operations.ts # Database helpers
└── docker-compose.yml      # Docker configuration
```

## Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review Docker and Prisma logs
3. Ensure all dependencies are installed
4. Verify environment variables are set correctly
