# Privacy-Focused Emergency Ambulance Booking System

A comprehensive PERN stack application for emergency ambulance booking that prioritizes patient privacy by storing only essential information while maintaining secure hospital-patient linkages.

## Features

- **Privacy-First Design**: Minimal patient data storage, medical records remain with hospitals
- **Emergency Links**: Secure patient-hospital-doctor linkage system
- **Real-time Ambulance Booking**: Quick emergency routing and tracking
- **Hospital Search**: Find hospitals by location, specialization, and department
- **Emergency Contacts**: Multiple emergency contact management
- **Health Categories**: Basic health tags without detailed medical information
- **Google Maps Integration**: Location tracking and route optimization

## Tech Stack

### Frontend
- React.js
- React Router
- Axios
- Google Maps JavaScript API
- Tailwind CSS

### Backend
- Node.js
- Express.js
- PostgreSQL
- JWT Authentication
- Bcrypt
- Multer
- Nodemailer

## Installation

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Setup Steps

1. **Clone the repository**
```bash
git clone <repository-url>
cd ambulance-booking
```

2. **Install dependencies**
```bash
npm run install-all
```

3. **Configure environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Set up PostgreSQL database**
```bash
# Create database
createdb ambulance_booking

# Run migrations
psql -U postgres -d ambulance_booking -f server/database/schema.sql
```

5. **Start the application**
```bash
# Development mode (both frontend and backend)
npm run dev

# Or run separately
npm run server  # Backend only
npm run client  # Frontend only
```

## Database Schema

### Core Tables
- **users**: Authentication and user roles
- **patients**: Basic patient profiles
- **emergency_contacts**: Patient emergency contacts
- **health_categories**: Patient health tags
- **hospitals**: Hospital information
- **departments**: Hospital departments
- **doctors**: Doctor profiles
- **emergency_links**: Patient-hospital-doctor linkages
- **ambulances**: Ambulance fleet management
- **bookings**: Ambulance booking records
- **booking_tracking**: Real-time location tracking

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Patients
- `GET /api/patients/profile` - Get patient profile
- `PUT /api/patients/profile` - Update patient profile
- `POST /api/patients/emergency-contacts` - Add emergency contact
- `PUT /api/patients/health-categories` - Update health categories

### Hospitals
- `GET /api/hospitals` - Search hospitals
- `GET /api/hospitals/:id` - Get hospital details
- `GET /api/hospitals/:id/departments` - Get hospital departments
- `GET /api/hospitals/:id/doctors` - Get hospital doctors

### Emergency Links
- `POST /api/emergency-links` - Create emergency link
- `GET /api/emergency-links` - Get patient's emergency links
- `DELETE /api/emergency-links/:id` - Remove emergency link

### Bookings
- `POST /api/bookings` - Create ambulance booking
- `GET /api/bookings` - Get user bookings
- `GET /api/bookings/:id` - Get booking details
- `PUT /api/bookings/:id/track` - Update ambulance location

## Environment Variables

See `.env.example` for all required environment variables.

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting
- Helmet.js security headers
- Input validation
- CORS protection

## Privacy Compliance

- Minimal data collection
- No detailed medical records stored
- Secure hospital linkage system
- Emergency-only data access
- GDPR-ready architecture

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions, please create an issue in the repository.
