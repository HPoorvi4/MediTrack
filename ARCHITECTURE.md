# System Architecture

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                         │
│                     (React Application)                      │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │   Home   │  │  Login   │  │Dashboard │  │ Profile  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │Hospitals │  │  Links   │  │ Bookings │  │ Details  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│                                                              │
│              ┌────────────────────────────┐                 │
│              │   React Context (Auth)     │                 │
│              └────────────────────────────┘                 │
└──────────────────────┬───────────────────────────────────────┘
                       │ HTTP/HTTPS (Axios)
                       │ JSON
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                      API GATEWAY LAYER                       │
│                    (Express Middleware)                      │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  CORS    │→ │  Helmet  │→ │   Rate   │→ │   Auth   │   │
│  │          │  │ Security │  │ Limiting │  │   JWT    │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└──────────────────────┬───────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                     APPLICATION LAYER                        │
│                    (Express Controllers)                     │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │     Auth     │  │   Patient    │  │   Hospital   │     │
│  │  Controller  │  │  Controller  │  │  Controller  │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│  ┌──────────────┐  ┌──────────────┐                        │
│  │ Emergency    │  │   Booking    │                        │
│  │ Link Ctrl    │  │  Controller  │                        │
│  └──────────────┘  └──────────────┘                        │
└──────────────────────┬───────────────────────────────────────┘
                       │ SQL Queries
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                       DATA LAYER                             │
│                   (PostgreSQL Database)                      │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  users   │  │ patients │  │emergency │  │  health  │   │
│  │          │  │          │  │ contacts │  │categories│   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │hospitals │  │departments│ │ doctors  │  │ambulances│   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │emergency │  │ bookings │  │ booking  │  │notifications│ │
│  │  links   │  │          │  │ tracking │  │          │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                         │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Google Maps  │  │   Nodemailer │  │  File Upload │     │
│  │     API      │  │    (Email)   │  │   (Multer)   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

---

## Request Flow

### 1. User Registration Flow

```
User (Browser)
    │
    │ 1. Fill registration form
    ▼
React Component (Register.js)
    │
    │ 2. Validate input
    │ 3. POST /api/auth/register
    ▼
Express Server
    │
    │ 4. Validation middleware
    ▼
Auth Controller
    │
    │ 5. Hash password (bcrypt)
    │ 6. BEGIN transaction
    ▼
PostgreSQL
    │
    │ 7. INSERT into users
    │ 8. INSERT into patients
    │ 9. COMMIT transaction
    ▼
Auth Controller
    │
    │ 10. Generate JWT token
    │ 11. Return user + token
    ▼
React Component
    │
    │ 12. Store token in localStorage
    │ 13. Update AuthContext
    │ 14. Redirect to dashboard
    ▼
User sees Dashboard
```

---

### 2. Ambulance Booking Flow

```
Patient Dashboard
    │
    │ 1. Click "Book Ambulance"
    ▼
Emergency Links Page
    │
    │ 2. Select hospital link
    │ 3. Choose emergency type
    ▼
Booking API Call
    │
    │ POST /api/bookings
    │ {
    │   emergency_link_id,
    │   emergency_type,
    │   pickup_location
    │ }
    ▼
Booking Controller
    │
    │ 4. Verify emergency link
    │ 5. Find available ambulance
    │ 6. BEGIN transaction
    ▼
Database Operations
    │
    │ 7. INSERT booking
    │ 8. UPDATE ambulance (unavailable)
    │ 9. INSERT tracking entry
    │ 10. INSERT notification
    │ 11. COMMIT transaction
    ▼
Email Service
    │
    │ 12. Send confirmation email
    │ 13. Send dispatch alert
    ▼
Response to Client
    │
    │ 14. Return booking details
    │     + ambulance info
    │     + hospital info
    ▼
Booking Details Page
    │
    │ 15. Display tracking info
    │ 16. Show driver contact
    │ 17. Real-time updates
    ▼
Patient tracks ambulance
```

---

## Authentication Flow

```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │
       │ 1. Login (email, password)
       ▼
┌─────────────────┐
│  Auth Endpoint  │
└────────┬────────┘
         │
         │ 2. Verify credentials
         │ 3. Compare password hash
         ▼
┌─────────────────┐
│   Database      │
└────────┬────────┘
         │
         │ 4. User found
         ▼
┌─────────────────┐
│ Generate JWT    │
│ {               │
│   id: user.id,  │
│   exp: 7 days   │
│ }               │
└────────┬────────┘
         │
         │ 5. Return token
         ▼
┌─────────────────┐
│     Client      │
│ Store in        │
│ localStorage    │
└────────┬────────┘
         │
         │ 6. All future requests
         │    Authorization: Bearer <token>
         ▼
┌─────────────────┐
│ Auth Middleware │
│ Verify token    │
│ Decode payload  │
│ Attach user     │
└────────┬────────┘
         │
         │ 7. Access granted
         ▼
┌─────────────────┐
│   Controller    │
│   req.user      │
└─────────────────┘
```

---

## Database Relationships

```
users (1) ──────────────────── (1) patients
                                     │
                    ┌────────────────┼────────────────┐
                    │                │                │
                    ▼                ▼                ▼
            emergency_contacts  health_categories  emergency_links
                                                         │
                                                         │
hospitals (1) ───────┬───────────────────────────────────┘
                     │
        ┌────────────┼────────────┬────────────┐
        │            │            │            │
        ▼            ▼            ▼            ▼
   departments   doctors    ambulances    bookings
        │            │                         │
        └────────────┘                         │
                                               ▼
                                        booking_tracking


Legend:
(1) = One-to-One
─── = One-to-Many
```

---

## Security Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      SECURITY LAYERS                         │
└─────────────────────────────────────────────────────────────┘

Layer 1: Network Security
├─ HTTPS (Production)
├─ CORS (Restricted origins)
└─ Rate Limiting (100 req/15min)

Layer 2: Authentication
├─ JWT Tokens (7 day expiry)
├─ Password Hashing (bcrypt, salt rounds: 10)
└─ Token Validation on every request

Layer 3: Authorization
├─ Role-Based Access Control
│  ├─ Patient: Own data only
│  ├─ Hospital Admin: Hospital data
│  ├─ Driver: Tracking updates
│  └─ Admin: Full access
└─ Resource Ownership Checks

Layer 4: Input Validation
├─ express-validator
├─ Type checking
├─ Sanitization
└─ Length limits

Layer 5: Database Security
├─ Parameterized Queries (SQL injection prevention)
├─ Foreign Key Constraints
├─ Cascading Deletes
└─ Transaction Support

Layer 6: Application Security
├─ Helmet.js (Security headers)
├─ XSS Protection
├─ Content Security Policy
└─ Error Handling (No sensitive data in errors)

Layer 7: Data Privacy
├─ Minimal Data Collection
├─ No Medical Records Storage
├─ Encrypted Passwords
└─ Secure Token Storage
```

---

## Data Flow Patterns

### Read Pattern (GET)
```
Client → Auth Middleware → Controller → Database → Response
```

### Write Pattern (POST/PUT)
```
Client → Auth Middleware → Validation → Controller
    → BEGIN Transaction
    → Database Operations
    → COMMIT/ROLLBACK
    → Response
```

### Complex Operation (Booking)
```
Client → Auth Middleware → Controller
    → Verify Resources
    → BEGIN Transaction
        → Create Booking
        → Update Ambulance
        → Create Tracking
        → Create Notification
    → COMMIT
    → Send Email (async)
    → Response
```

---

## Component Architecture (Frontend)

```
App.js (Router)
    │
    ├─ AuthProvider (Context)
    │   └─ Provides: user, login, logout, register
    │
    ├─ Navbar (Always visible)
    │
    └─ Routes
        ├─ Public Routes
        │   ├─ Home
        │   ├─ Login
        │   └─ Register
        │
        └─ Private Routes (Protected)
            ├─ Dashboard
            ├─ Profile
            ├─ Hospitals
            ├─ Emergency Links
            ├─ Bookings
            └─ Booking Details

Each Page Component:
    ├─ useState (Local state)
    ├─ useEffect (Data fetching)
    ├─ useAuth (Global auth state)
    ├─ API calls (via utils/api.js)
    └─ Child Components
```

---

## API Layer Architecture

```
server.js (Entry Point)
    │
    ├─ Middleware Stack
    │   ├─ helmet (Security)
    │   ├─ cors (CORS)
    │   ├─ express.json (Body parsing)
    │   ├─ rate-limit (Rate limiting)
    │   └─ errorHandler (Error handling)
    │
    ├─ Routes
    │   ├─ /api/auth → authRoutes
    │   ├─ /api/patients → patientRoutes
    │   ├─ /api/hospitals → hospitalRoutes
    │   ├─ /api/emergency-links → emergencyLinkRoutes
    │   └─ /api/bookings → bookingRoutes
    │
    └─ Each Route
        ├─ Validation Middleware
        ├─ Auth Middleware (protect)
        ├─ Authorization Middleware (authorize)
        └─ Controller Function
            ├─ Business Logic
            ├─ Database Queries
            └─ Response
```

---

## Deployment Architecture

### Development
```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   React Dev  │────▶│  Express Dev │────▶│  PostgreSQL  │
│  localhost:  │     │  localhost:  │     │  localhost:  │
│     3000     │     │     5000     │     │     5432     │
└──────────────┘     └──────────────┘     └──────────────┘
```

### Production
```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Netlify/   │────▶│   Heroku/    │────▶│  Heroku      │
│   Vercel     │     │   AWS/Azure  │     │  Postgres/   │
│  (Frontend)  │     │  (Backend)   │     │  AWS RDS     │
└──────────────┘     └──────────────┘     └──────────────┘
      │                     │                     │
      │                     │                     │
      ▼                     ▼                     ▼
   CDN/Edge            Load Balancer        Replication
   Caching             Auto-scaling         Backups
```

---

## Scalability Considerations

### Current Architecture (Single Server)
```
Users → Server → Database
```
**Capacity**: Hundreds of concurrent users

### Scaled Architecture (Future)
```
                    ┌─ Server 1 ─┐
Users → Load Bal. → ├─ Server 2 ─┤ → Master DB
                    └─ Server 3 ─┘      │
                                        ├─ Read Replica 1
                                        └─ Read Replica 2
                    ┌─ Redis Cache
                    └─ CDN (Static files)
```
**Capacity**: Thousands of concurrent users

---

## Technology Stack Layers

```
┌─────────────────────────────────────────┐
│         Presentation Layer              │
│  React, React Router, CSS, Lucide       │
└─────────────────────────────────────────┘
                   │
┌─────────────────────────────────────────┐
│         Application Layer               │
│  Express.js, Controllers, Middleware    │
└─────────────────────────────────────────┘
                   │
┌─────────────────────────────────────────┐
│         Business Logic Layer            │
│  Authentication, Validation, Email      │
└─────────────────────────────────────────┘
                   │
┌─────────────────────────────────────────┐
│         Data Access Layer               │
│  PostgreSQL, SQL Queries, Transactions  │
└─────────────────────────────────────────┘
                   │
┌─────────────────────────────────────────┐
│         Data Storage Layer              │
│  PostgreSQL Database, File System       │
└─────────────────────────────────────────┘
```

---

## Privacy Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    PRIVACY DESIGN                            │
└─────────────────────────────────────────────────────────────┘

What We Store:
├─ Basic Identity (Name, DOB, Gender)
├─ Contact Info (Phone, Email, Address)
├─ Emergency Contacts (3 max)
├─ Health Tags (General categories only)
└─ Hospital Links (Connections, not records)

What We DON'T Store:
├─ ✗ Detailed Medical History
├─ ✗ Prescriptions
├─ ✗ Lab Results
├─ ✗ Treatment Records
├─ ✗ Insurance Details
└─ ✗ Payment Information

Where Medical Data Lives:
Hospital Database (Not our system)
    ├─ Full medical records
    ├─ Treatment history
    ├─ Prescriptions
    └─ Lab results

Our Role:
Emergency Routing Only
    ├─ Connect patient to hospital
    ├─ Dispatch ambulance
    ├─ Track location
    └─ Facilitate communication
```

---

This architecture ensures:
- ✅ Scalability
- ✅ Security
- ✅ Privacy
- ✅ Maintainability
- ✅ Performance
- ✅ Reliability
