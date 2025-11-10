# Quick Start Guide - 5 Minutes Setup

## Prerequisites
- Node.js installed
- PostgreSQL installed and running

## 1. Database Setup (1 minute)

```bash
# Create database
createdb ambulance_booking

# Run schema
psql -U postgres -d ambulance_booking -f server/database/schema.sql

# Optional: Add sample data
psql -U postgres -d ambulance_booking -f server/database/seed.sql
```

## 2. Install Dependencies (2 minutes)

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

## 3. Configure Environment (1 minute)

```bash
# Copy environment file
copy .env.example .env
```

Edit `.env` and update these minimum required fields:
```env
DB_PASSWORD=your_postgres_password
JWT_SECRET=any_random_string_here
```

## 4. Start Application (1 minute)

```bash
# Start both frontend and backend
npm run dev
```

## 5. Access Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## First Steps

1. **Register** a new patient account
2. **Complete** your profile
3. **Search** for hospitals (sample data available if you ran seed.sql)
4. **Create** emergency links
5. **Book** an ambulance

## Default Credentials

No default patient accounts. You must register through the UI.

Sample hospitals are available if you ran the seed.sql file.

## Common Issues

**Port 5000 already in use?**
- Change `PORT=5001` in `.env`

**Database connection failed?**
- Check PostgreSQL is running: `pg_isready`
- Verify DB_PASSWORD in `.env`

**Frontend won't start?**
- Delete `client/node_modules` and run `npm install` again

## Next Steps

- Read SETUP_GUIDE.md for detailed configuration
- Check FEATURES.md for complete feature list
- Review API documentation in README.md

## Need Help?

1. Check troubleshooting in SETUP_GUIDE.md
2. Review error messages in terminal
3. Ensure all prerequisites are installed

---

**That's it! You're ready to use the Ambulance Booking System! 🚑**
