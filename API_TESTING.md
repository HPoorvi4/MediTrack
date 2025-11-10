# API Testing Guide

This guide provides example requests for testing all API endpoints using tools like Postman, Insomnia, or cURL.

## Base URL
```
http://localhost:5000/api
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## 1. Authentication Endpoints

### Register New Patient
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "john.doe@example.com",
  "password": "password123",
  "full_name": "John Doe",
  "date_of_birth": "1990-05-15",
  "gender": "Male",
  "blood_group": "O+",
  "contact_number": "+91-9876543210",
  "address": "123 Main Street",
  "city": "Mumbai",
  "state": "Maharashtra",
  "pin_code": "400001"
}
```

**Response:**
```json
{
  "id": "uuid-here",
  "email": "john.doe@example.com",
  "role": "patient",
  "token": "jwt-token-here"
}
```

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "id": "uuid-here",
  "email": "john.doe@example.com",
  "role": "patient",
  "token": "jwt-token-here"
}
```

### Get Current User
```http
GET /api/auth/me
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response:**
```json
{
  "user": {
    "id": "uuid-here",
    "email": "john.doe@example.com",
    "role": "patient",
    "is_active": true
  },
  "profile": {
    "full_name": "John Doe",
    "blood_group": "O+",
    ...
  }
}
```

---

## 2. Patient Endpoints

### Get Patient Profile
```http
GET /api/patients/profile
Authorization: Bearer YOUR_JWT_TOKEN
```

### Update Patient Profile
```http
PUT /api/patients/profile
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "full_name": "John Doe Updated",
  "contact_number": "+91-9876543211",
  "address": "456 New Street",
  "city": "Mumbai",
  "state": "Maharashtra",
  "pin_code": "400002"
}
```

### Add Emergency Contact
```http
POST /api/patients/emergency-contacts
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "contact_name": "Jane Doe",
  "relation": "Wife",
  "phone_number": "+91-9876543220",
  "priority": 1
}
```

### Update Emergency Contact
```http
PUT /api/patients/emergency-contacts/{contact_id}
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "contact_name": "Jane Doe Updated",
  "relation": "Spouse",
  "phone_number": "+91-9876543221",
  "priority": 1
}
```

### Delete Emergency Contact
```http
DELETE /api/patients/emergency-contacts/{contact_id}
Authorization: Bearer YOUR_JWT_TOKEN
```

### Update Health Categories
```http
PUT /api/patients/health-categories
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "categories": [
    {
      "category": "Cardiac Patient",
      "additional_info": null
    },
    {
      "category": "Diabetic",
      "additional_info": "Type 2"
    }
  ]
}
```

---

## 3. Hospital Endpoints

### Search Hospitals
```http
GET /api/hospitals?city=Mumbai&department=Cardiology
```

**Query Parameters:**
- `city` - Filter by city name
- `state` - Filter by state
- `name` - Search by hospital name
- `department` - Filter by department
- `latitude` - For location-based search
- `longitude` - For location-based search
- `radius` - Search radius in km (requires lat/long)

**Example:**
```http
GET /api/hospitals?city=Mumbai
GET /api/hospitals?latitude=19.0760&longitude=72.8777&radius=10
```

### Get Hospital Details
```http
GET /api/hospitals/{hospital_id}
```

**Response:**
```json
{
  "id": "uuid-here",
  "name": "City General Hospital",
  "address": "123 Main Street",
  "city": "Mumbai",
  "contact_number": "+91-9876543210",
  "has_emergency": true,
  "has_icu": true,
  "rating": 4.5,
  "departments": [...],
  "available_ambulances": 3
}
```

### Get Hospital Departments
```http
GET /api/hospitals/{hospital_id}/departments
```

### Get Hospital Doctors
```http
GET /api/hospitals/{hospital_id}/doctors
GET /api/hospitals/{hospital_id}/doctors?department_id={dept_id}
```

### Get Available Ambulances
```http
GET /api/hospitals/{hospital_id}/ambulances
```

---

## 4. Emergency Links Endpoints

### Create Emergency Link
```http
POST /api/emergency-links
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "hospital_id": "hospital-uuid-here",
  "department_id": "department-uuid-here",
  "doctor_id": "doctor-uuid-here",
  "link_type": "doctor",
  "is_primary": true,
  "notes": "My regular cardiologist"
}
```

**Link Types:**
- `hospital` - Link to entire hospital
- `department` - Link to specific department
- `doctor` - Link to specific doctor

### Get All Emergency Links
```http
GET /api/emergency-links
Authorization: Bearer YOUR_JWT_TOKEN
```

### Update Emergency Link
```http
PUT /api/emergency-links/{link_id}
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "is_primary": true,
  "notes": "Updated notes"
}
```

### Delete Emergency Link
```http
DELETE /api/emergency-links/{link_id}
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## 5. Booking Endpoints

### Create Ambulance Booking
```http
POST /api/bookings
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "emergency_link_id": "link-uuid-here",
  "emergency_type": "Cardiac",
  "pickup_address": "123 Main Street, Mumbai",
  "pickup_latitude": 19.0760,
  "pickup_longitude": 72.8777,
  "patient_condition": "Chest pain, difficulty breathing"
}
```

**Emergency Types:**
- `Cardiac`
- `Respiratory`
- `Accident`
- `Neurological`
- `Pregnancy`
- `General`

**Response:**
```json
{
  "booking": {
    "id": "booking-uuid-here",
    "status": "confirmed",
    "emergency_type": "Cardiac",
    "estimated_arrival_time": "2024-01-15T10:30:00Z"
  },
  "ambulance": {
    "vehicle_number": "MH-01-AB-1234",
    "vehicle_type": "ICU",
    "driver_name": "Ramesh Singh",
    "driver_contact": "+91-9876543220"
  },
  "hospital": {
    "name": "City General Hospital",
    "address": "123 Main Street"
  }
}
```

### Get All Bookings
```http
GET /api/bookings
Authorization: Bearer YOUR_JWT_TOKEN
```

**With Status Filter:**
```http
GET /api/bookings?status=confirmed
GET /api/bookings?status=completed
```

### Get Booking Details
```http
GET /api/bookings/{booking_id}
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response includes:**
- Booking information
- Hospital details
- Ambulance details
- Tracking history
- Current status

### Update Booking Status
```http
PUT /api/bookings/{booking_id}/status
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "status": "cancelled",
  "cancellation_reason": "Patient condition improved"
}
```

**Valid Status Values:**
- `pending`
- `confirmed`
- `ambulance_dispatched`
- `ambulance_arrived`
- `patient_picked`
- `in_transit`
- `reached_hospital`
- `completed`
- `cancelled`

### Track Ambulance (Driver/Admin only)
```http
POST /api/bookings/{booking_id}/track
Authorization: Bearer DRIVER_OR_ADMIN_TOKEN
Content-Type: application/json

{
  "latitude": 19.0760,
  "longitude": 72.8777,
  "status_update": "Ambulance en route to pickup location"
}
```

---

## Testing Workflow

### 1. Setup
1. Start the server
2. Create a new patient account (register)
3. Save the JWT token from response

### 2. Complete Profile
1. Add emergency contacts
2. Update health categories
3. Verify profile data

### 3. Find Hospital
1. Search hospitals by city
2. Get hospital details
3. View departments and doctors

### 4. Create Emergency Link
1. Select a hospital
2. Create emergency link
3. Set as primary if needed

### 5. Book Ambulance
1. Use emergency link ID
2. Create booking with emergency type
3. Get booking confirmation

### 6. Track Booking
1. Get booking details
2. View tracking history
3. Check ambulance location

### 7. Complete/Cancel
1. Update booking status
2. Verify completion

---

## Common Response Codes

- `200 OK` - Successful GET/PUT/DELETE
- `201 Created` - Successful POST
- `400 Bad Request` - Validation error
- `401 Unauthorized` - Missing/invalid token
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

---

## Error Response Format

```json
{
  "message": "Error description here",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

---

## Postman Collection

You can import this as a Postman collection:

1. Create new collection "Ambulance Booking API"
2. Add environment variables:
   - `base_url`: http://localhost:5000/api
   - `token`: (will be set after login)
3. Add all endpoints from above
4. Use `{{base_url}}` and `{{token}}` variables

---

## cURL Examples

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "full_name": "Test User",
    "date_of_birth": "1990-01-01",
    "gender": "Male",
    "blood_group": "O+",
    "contact_number": "+91-9876543210",
    "address": "Test Address",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pin_code": "400001"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Get Profile (with token)
```bash
curl -X GET http://localhost:5000/api/patients/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Search Hospitals
```bash
curl -X GET "http://localhost:5000/api/hospitals?city=Mumbai"
```

### Create Booking
```bash
curl -X POST http://localhost:5000/api/bookings \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "emergency_link_id": "link-uuid",
    "emergency_type": "Cardiac",
    "pickup_address": "123 Main St",
    "pickup_latitude": 19.0760,
    "pickup_longitude": 72.8777
  }'
```

---

## Automated Testing

For automated testing, consider using:
- **Jest** + **Supertest** for backend API tests
- **Postman** automated test scripts
- **Newman** for CI/CD integration

Example Jest test:
```javascript
describe('Auth API', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        password: 'password123',
        // ... other fields
      });
    
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('token');
  });
});
```
