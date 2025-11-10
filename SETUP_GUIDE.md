# Complete Setup Guide - Ambulance Booking System

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **PostgreSQL** (v12 or higher) - [Download](https://www.postgresql.org/download/)
- **npm** or **yarn** package manager
- **Git** (optional, for version control)

## Step-by-Step Installation

### 1. Database Setup

#### Install PostgreSQL
1. Download and install PostgreSQL from the official website
2. During installation, remember the password you set for the `postgres` user
3. PostgreSQL typically runs on port 5432

#### Create Database
Open PostgreSQL command line (psql) or pgAdmin and run:

```sql
CREATE DATABASE ambulance_booking;
```

Or using command line:
```bash
createdb ambulance_booking
```

#### Run Database Schema
Navigate to the project directory and run:

```bash
psql -U postgres -d ambulance_booking -f server/database/schema.sql
```

If you want to add sample data for testing:
```bash
psql -U postgres -d ambulance_booking -f server/database/seed.sql
```

### 2. Backend Setup

#### Install Dependencies
```bash
# From project root directory
npm install
```

#### Configure Environment Variables
1. Copy the example environment file:
```bash
copy .env.example .env
```

2. Edit `.env` file with your configuration:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ambulance_booking
DB_USER=postgres
DB_PASSWORD=your_postgres_password

# JWT Secret (generate a random string)
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRE=7d

# Email Configuration (Gmail example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_gmail_app_password

# Google Maps API Key
GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Frontend URL
CLIENT_URL=http://localhost:3000
```

#### Gmail App Password Setup
1. Go to your Google Account settings
2. Enable 2-Step Verification
3. Go to Security > App passwords
4. Generate a new app password for "Mail"
5. Use this password in EMAIL_PASSWORD

#### Google Maps API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable "Maps JavaScript API" and "Places API"
4. Create credentials (API Key)
5. Add the API key to your `.env` file

### 3. Frontend Setup

#### Install Frontend Dependencies
```bash
cd client
npm install
```

#### Configure Google Maps in Frontend
Edit `client/public/index.html` and replace `YOUR_GOOGLE_MAPS_API_KEY` with your actual API key:

```html
<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_ACTUAL_API_KEY&libraries=places"></script>
```

### 4. Running the Application

#### Option 1: Run Both Frontend and Backend Together
From the project root directory:
```bash
npm run dev
```

This will start:
- Backend server on http://localhost:5000
- Frontend React app on http://localhost:3000

#### Option 2: Run Separately

**Backend:**
```bash
npm run server
```

**Frontend (in a new terminal):**
```bash
cd client
npm start
```

### 5. Testing the Application

1. Open your browser and navigate to `http://localhost:3000`
2. Register a new patient account
3. Complete your profile
4. Search for hospitals
5. Create emergency links
6. Book an ambulance

## Default Test Accounts

If you ran the seed.sql file, you'll have sample hospitals in the database. You'll need to create your own patient account through the registration form.

## Troubleshooting

### Database Connection Issues
- Verify PostgreSQL is running: `pg_isready`
- Check your database credentials in `.env`
- Ensure the database exists: `psql -U postgres -l`

### Port Already in Use
If port 5000 or 3000 is already in use:
- Change PORT in `.env` for backend
- React will automatically suggest another port for frontend

### Email Not Sending
- Verify Gmail app password is correct
- Check if 2-Step Verification is enabled
- Try using a different email service

### Google Maps Not Loading
- Verify API key is correct
- Check if Maps JavaScript API is enabled in Google Cloud Console
- Ensure billing is enabled (Google requires it even for free tier)

## Production Deployment

### Backend Deployment (Heroku Example)

1. Install Heroku CLI
2. Create a new Heroku app:
```bash
heroku create your-app-name
```

3. Add PostgreSQL addon:
```bash
heroku addons:create heroku-postgresql:hobby-dev
```

4. Set environment variables:
```bash
heroku config:set JWT_SECRET=your_secret
heroku config:set NODE_ENV=production
# ... set all other environment variables
```

5. Deploy:
```bash
git push heroku main
```

### Frontend Deployment (Netlify/Vercel)

1. Build the frontend:
```bash
cd client
npm run build
```

2. Deploy the `build` folder to Netlify or Vercel
3. Set environment variable `REACT_APP_API_URL` to your backend URL

## Security Checklist

- [ ] Change JWT_SECRET to a strong random string
- [ ] Use environment variables for all sensitive data
- [ ] Enable HTTPS in production
- [ ] Set up CORS properly for production domains
- [ ] Use strong database passwords
- [ ] Keep dependencies updated
- [ ] Implement rate limiting (already included)
- [ ] Regular database backups

## API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Patient Endpoints
- `GET /api/patients/profile` - Get profile
- `PUT /api/patients/profile` - Update profile
- `POST /api/patients/emergency-contacts` - Add emergency contact
- `PUT /api/patients/health-categories` - Update health categories

### Hospital Endpoints
- `GET /api/hospitals` - Search hospitals
- `GET /api/hospitals/:id` - Get hospital details
- `GET /api/hospitals/:id/departments` - Get departments
- `GET /api/hospitals/:id/doctors` - Get doctors

### Emergency Links Endpoints
- `POST /api/emergency-links` - Create link
- `GET /api/emergency-links` - Get all links
- `PUT /api/emergency-links/:id` - Update link
- `DELETE /api/emergency-links/:id` - Delete link

### Booking Endpoints
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - Get all bookings
- `GET /api/bookings/:id` - Get booking details
- `PUT /api/bookings/:id/status` - Update status

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review the code comments
3. Check database logs: `tail -f /var/log/postgresql/postgresql-*.log`
4. Check application logs in the terminal

## License

MIT License - See LICENSE file for details
