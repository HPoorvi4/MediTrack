# Project Structure

```
Ambulance booking/
│
├── client/                          # React Frontend
│   ├── public/
│   │   ├── index.html              # Main HTML file with Google Maps script
│   │   └── manifest.json           # PWA manifest
│   │
│   ├── src/
│   │   ├── components/             # Reusable React components
│   │   │   ├── Navbar.js          # Navigation bar
│   │   │   ├── Navbar.css
│   │   │   ├── PrivateRoute.js    # Protected route wrapper
│   │   │   └── LoadingSpinner.js  # Loading indicator
│   │   │
│   │   ├── context/               # React Context for state management
│   │   │   └── AuthContext.js     # Authentication context & provider
│   │   │
│   │   ├── pages/                 # Main application pages
│   │   │   ├── Home.js            # Landing page
│   │   │   ├── Home.css
│   │   │   ├── Login.js           # Login page
│   │   │   ├── Register.js        # Registration page
│   │   │   ├── Auth.css           # Shared auth styles
│   │   │   ├── Dashboard.js       # User dashboard
│   │   │   ├── Dashboard.css
│   │   │   ├── Profile.js         # User profile management
│   │   │   ├── Profile.css
│   │   │   ├── Hospitals.js       # Hospital search
│   │   │   ├── Hospitals.css
│   │   │   ├── EmergencyLinks.js  # Emergency links management
│   │   │   ├── EmergencyLinks.css
│   │   │   ├── Bookings.js        # Booking list
│   │   │   ├── Bookings.css
│   │   │   ├── BookingDetails.js  # Individual booking details
│   │   │   └── BookingDetails.css
│   │   │
│   │   ├── utils/                 # Utility functions
│   │   │   ├── api.js             # API service layer
│   │   │   └── constants.js       # App constants
│   │   │
│   │   ├── App.js                 # Main App component with routing
│   │   ├── index.js               # React entry point
│   │   └── index.css              # Global styles
│   │
│   └── package.json               # Frontend dependencies
│
├── server/                         # Node.js Backend
│   ├── config/
│   │   └── db.js                  # Database connection configuration
│   │
│   ├── controllers/               # Request handlers
│   │   ├── authController.js      # Authentication logic
│   │   ├── patientController.js   # Patient operations
│   │   ├── hospitalController.js  # Hospital operations
│   │   ├── emergencyLinkController.js  # Emergency links
│   │   └── bookingController.js   # Booking operations
│   │
│   ├── middleware/                # Express middleware
│   │   ├── auth.js                # JWT authentication
│   │   ├── errorHandler.js        # Error handling
│   │   └── upload.js              # File upload (Multer)
│   │
│   ├── routes/                    # API routes
│   │   ├── authRoutes.js          # /api/auth/*
│   │   ├── patientRoutes.js       # /api/patients/*
│   │   ├── hospitalRoutes.js      # /api/hospitals/*
│   │   ├── emergencyLinkRoutes.js # /api/emergency-links/*
│   │   └── bookingRoutes.js       # /api/bookings/*
│   │
│   ├── utils/                     # Utility functions
│   │   └── emailService.js        # Email notifications (Nodemailer)
│   │
│   ├── database/                  # Database files
│   │   ├── schema.sql             # Database schema
│   │   └── seed.sql               # Sample data
│   │
│   └── server.js                  # Express server entry point
│
├── uploads/                        # User uploaded files
│   └── .gitkeep
│
├── .env.example                   # Environment variables template
├── .gitignore                     # Git ignore rules
├── package.json                   # Backend dependencies & scripts
├── README.md                      # Project overview
├── SETUP_GUIDE.md                 # Detailed setup instructions
├── QUICKSTART.md                  # Quick 5-minute setup
├── FEATURES.md                    # Complete feature list
├── PROJECT_STRUCTURE.md           # This file
└── LICENSE                        # MIT License

```

## Key Directories Explained

### `/client` - Frontend Application
React-based single-page application with modern UI/UX.

**Components**: Reusable UI elements
**Pages**: Full page components with routing
**Context**: Global state management
**Utils**: Helper functions and API calls

### `/server` - Backend API
RESTful API built with Express.js and PostgreSQL.

**Controllers**: Business logic for each feature
**Routes**: API endpoint definitions
**Middleware**: Request processing (auth, validation, errors)
**Config**: Database and app configuration

### `/server/database` - Database Files
SQL files for database setup and seeding.

## Technology Stack

### Frontend
- **React** 18.2.0 - UI library
- **React Router** 6.20.1 - Client-side routing
- **Axios** 1.6.2 - HTTP client
- **Lucide React** - Icon library
- **React Toastify** - Notifications

### Backend
- **Express** 4.18.2 - Web framework
- **PostgreSQL** (pg 8.11.3) - Database
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Nodemailer** - Email service
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing

## Data Flow

```
User Action (Frontend)
    ↓
React Component
    ↓
API Call (axios)
    ↓
Express Route
    ↓
Middleware (auth, validation)
    ↓
Controller (business logic)
    ↓
Database Query (PostgreSQL)
    ↓
Response
    ↓
Frontend Update
```

## API Structure

```
/api
├── /auth
│   ├── POST /register
│   ├── POST /login
│   └── GET /me
│
├── /patients
│   ├── GET /profile
│   ├── PUT /profile
│   ├── POST /emergency-contacts
│   ├── PUT /emergency-contacts/:id
│   ├── DELETE /emergency-contacts/:id
│   └── PUT /health-categories
│
├── /hospitals
│   ├── GET /
│   ├── GET /:id
│   ├── GET /:id/departments
│   ├── GET /:id/doctors
│   └── GET /:id/ambulances
│
├── /emergency-links
│   ├── POST /
│   ├── GET /
│   ├── PUT /:id
│   └── DELETE /:id
│
└── /bookings
    ├── POST /
    ├── GET /
    ├── GET /:id
    ├── PUT /:id/status
    └── POST /:id/track
```

## Database Schema Overview

```
users (authentication)
    ↓
patients (profile data)
    ├── emergency_contacts
    └── health_categories
    
hospitals
    ├── departments
    ├── doctors
    └── ambulances
    
emergency_links (patient ↔ hospital)

bookings
    └── booking_tracking
    
notifications
```

## File Naming Conventions

- **Components**: PascalCase (e.g., `Navbar.js`)
- **Pages**: PascalCase (e.g., `Dashboard.js`)
- **Utilities**: camelCase (e.g., `emailService.js`)
- **Routes**: camelCase with 'Routes' suffix (e.g., `authRoutes.js`)
- **Controllers**: camelCase with 'Controller' suffix (e.g., `authController.js`)
- **CSS**: Same name as component (e.g., `Navbar.css`)

## Environment Variables

Required in `.env`:
- Database credentials (DB_*)
- JWT secret
- Email configuration (EMAIL_*)
- Google Maps API key
- Server port and client URL

## Scripts Available

```bash
# Root directory
npm run server      # Start backend only
npm run client      # Start frontend only
npm run dev         # Start both (concurrently)
npm run install-all # Install all dependencies

# Client directory
npm start           # Start React dev server
npm run build       # Build for production
npm test            # Run tests
```

## Port Configuration

- **Backend**: 5000 (configurable via PORT in .env)
- **Frontend**: 3000 (React default)
- **Database**: 5432 (PostgreSQL default)

## Security Layers

1. **Authentication**: JWT tokens
2. **Authorization**: Role-based access control
3. **Input Validation**: express-validator
4. **SQL Injection**: Parameterized queries
5. **XSS Protection**: Helmet.js
6. **Rate Limiting**: express-rate-limit
7. **CORS**: Configured for specific origins
8. **Password Hashing**: bcrypt with salt

## Development Workflow

1. Start PostgreSQL
2. Run `npm run dev` from root
3. Access frontend at localhost:3000
4. API available at localhost:5000
5. Make changes (hot reload enabled)
6. Test features
7. Commit changes

## Production Considerations

- Set NODE_ENV=production
- Use strong JWT_SECRET
- Enable HTTPS
- Configure proper CORS origins
- Set up database backups
- Use environment-specific configs
- Implement logging
- Monitor performance
- Set up CI/CD pipeline
