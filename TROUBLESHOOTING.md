# Troubleshooting Guide

Common issues and their solutions for the Ambulance Booking System.

---

## Database Issues

### ❌ "Database connection failed"

**Symptoms:**
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solutions:**
1. Check if PostgreSQL is running:
   ```bash
   pg_isready
   ```

2. Start PostgreSQL:
   ```bash
   # Windows
   net start postgresql-x64-14
   
   # Mac
   brew services start postgresql
   
   # Linux
   sudo systemctl start postgresql
   ```

3. Verify credentials in `.env`:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=ambulance_booking
   DB_USER=postgres
   DB_PASSWORD=your_password
   ```

4. Test connection manually:
   ```bash
   psql -U postgres -d ambulance_booking
   ```

---

### ❌ "Database does not exist"

**Symptoms:**
```
error: database "ambulance_booking" does not exist
```

**Solution:**
```bash
createdb ambulance_booking
psql -U postgres -d ambulance_booking -f server/database/schema.sql
```

---

### ❌ "Permission denied for database"

**Solution:**
1. Grant permissions:
   ```sql
   GRANT ALL PRIVILEGES ON DATABASE ambulance_booking TO postgres;
   ```

2. Or create a new user:
   ```sql
   CREATE USER ambulance_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE ambulance_booking TO ambulance_user;
   ```

---

## Server Issues

### ❌ "Port 5000 already in use"

**Symptoms:**
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solutions:**

**Option 1: Change port**
Edit `.env`:
```env
PORT=5001
```

**Option 2: Kill process using port 5000**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

---

### ❌ "Module not found"

**Symptoms:**
```
Error: Cannot find module 'express'
```

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Or for frontend
cd client
rm -rf node_modules package-lock.json
npm install
```

---

### ❌ "JWT Secret not defined"

**Symptoms:**
```
Error: JWT_SECRET is not defined
```

**Solution:**
Add to `.env`:
```env
JWT_SECRET=your_super_secret_key_here_change_this_in_production
```

Generate a secure secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Frontend Issues

### ❌ "Port 3000 already in use"

**Symptoms:**
```
Something is already running on port 3000
```

**Solution:**
React will automatically suggest another port (3001). Type `Y` to accept.

Or manually kill the process:
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

---

### ❌ "Proxy error: Could not proxy request"

**Symptoms:**
```
Proxy error: Could not proxy request /api/auth/login
```

**Solutions:**
1. Ensure backend is running on port 5000
2. Check `client/package.json` has:
   ```json
   "proxy": "http://localhost:5000"
   ```
3. Restart both frontend and backend

---

### ❌ "Network Error" or "Request failed with status code 401"

**Solutions:**
1. Check if backend is running
2. Verify token is being sent:
   - Open browser DevTools → Network tab
   - Check request headers for `Authorization: Bearer ...`
3. Token might be expired - login again
4. Clear localStorage:
   ```javascript
   localStorage.clear()
   ```

---

## Email Issues

### ❌ "Email not sending"

**Symptoms:**
- No email received after booking
- Error in server logs about email

**Solutions:**

**For Gmail:**
1. Enable 2-Step Verification
2. Generate App Password:
   - Google Account → Security → App passwords
   - Select "Mail" and generate
3. Update `.env`:
   ```env
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=generated_app_password
   ```

**For other providers:**
Update SMTP settings in `.env`:
```env
EMAIL_HOST=smtp.your-provider.com
EMAIL_PORT=587
EMAIL_USER=your_email
EMAIL_PASSWORD=your_password
```

**Test email configuration:**
```javascript
// Add to server.js temporarily
const { sendEmail } = require('./utils/emailService');
sendEmail('test@example.com', 'Test', '<p>Test email</p>')
  .then(() => console.log('Email sent'))
  .catch(err => console.error('Email error:', err));
```

---

## Authentication Issues

### ❌ "Invalid credentials"

**Solutions:**
1. Verify email and password are correct
2. Check if user exists in database:
   ```sql
   SELECT * FROM users WHERE email = 'your_email@example.com';
   ```
3. Reset password (manual):
   ```javascript
   const bcrypt = require('bcrypt');
   const hash = await bcrypt.hash('newpassword', 10);
   // Update in database
   ```

---

### ❌ "Token expired" or "Not authorized"

**Solutions:**
1. Login again to get new token
2. Check JWT_EXPIRE in `.env`:
   ```env
   JWT_EXPIRE=7d
   ```
3. Clear browser cache and localStorage
4. Verify token in browser DevTools → Application → Local Storage

---

## Google Maps Issues

### ❌ "Google Maps not loading"

**Symptoms:**
- Map shows gray area
- Console error: "Google Maps JavaScript API error"

**Solutions:**
1. Get API key from [Google Cloud Console](https://console.cloud.google.com/)
2. Enable required APIs:
   - Maps JavaScript API
   - Places API
   - Geocoding API
3. Update `client/public/index.html`:
   ```html
   <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_ACTUAL_KEY&libraries=places"></script>
   ```
4. Add API key to `.env`:
   ```env
   GOOGLE_MAPS_API_KEY=your_key_here
   ```
5. Enable billing in Google Cloud (required even for free tier)

---

## Build Issues

### ❌ "Build failed" during npm run build

**Solutions:**
1. Check for console errors
2. Ensure all imports are correct
3. Remove unused variables:
   ```javascript
   // Add to top of file
   /* eslint-disable no-unused-vars */
   ```
4. Clear cache:
   ```bash
   cd client
   rm -rf node_modules/.cache
   npm run build
   ```

---

## CORS Issues

### ❌ "CORS policy: No 'Access-Control-Allow-Origin' header"

**Solutions:**
1. Check CORS configuration in `server/server.js`:
   ```javascript
   app.use(cors({
     origin: process.env.CLIENT_URL || 'http://localhost:3000',
     credentials: true,
   }));
   ```
2. Update CLIENT_URL in `.env`:
   ```env
   CLIENT_URL=http://localhost:3000
   ```
3. For production, set to your actual domain

---

## Performance Issues

### ❌ "Application is slow"

**Solutions:**
1. Check database indexes:
   ```sql
   SELECT * FROM pg_indexes WHERE tablename = 'bookings';
   ```
2. Optimize queries (use EXPLAIN):
   ```sql
   EXPLAIN ANALYZE SELECT * FROM bookings WHERE patient_id = 'uuid';
   ```
3. Add connection pooling (already implemented)
4. Enable caching for static data
5. Check server resources:
   ```bash
   # Check CPU and memory
   top
   ```

---

## Data Issues

### ❌ "No hospitals showing up"

**Solutions:**
1. Run seed file:
   ```bash
   psql -U postgres -d ambulance_booking -f server/database/seed.sql
   ```
2. Manually insert test hospital:
   ```sql
   INSERT INTO hospitals (name, registration_number, contact_number, email, address, city, state, pin_code, is_verified)
   VALUES ('Test Hospital', 'TEST001', '+91-1234567890', 'test@hospital.com', '123 Test St', 'Mumbai', 'Maharashtra', '400001', true);
   ```

---

### ❌ "Cannot create emergency link"

**Solutions:**
1. Verify hospital exists:
   ```sql
   SELECT * FROM hospitals WHERE id = 'hospital-uuid';
   ```
2. Check if link already exists:
   ```sql
   SELECT * FROM emergency_links WHERE patient_id = 'patient-uuid' AND hospital_id = 'hospital-uuid';
   ```
3. Check patient profile exists:
   ```sql
   SELECT * FROM patients WHERE user_id = 'user-uuid';
   ```

---

## Booking Issues

### ❌ "No ambulances available"

**Solutions:**
1. Check ambulance availability:
   ```sql
   SELECT * FROM ambulances WHERE hospital_id = 'hospital-uuid' AND is_available = true;
   ```
2. Add test ambulance:
   ```sql
   INSERT INTO ambulances (hospital_id, vehicle_number, vehicle_type, driver_name, driver_contact, is_available)
   VALUES ('hospital-uuid', 'TEST-123', 'Advanced', 'Test Driver', '+91-1234567890', true);
   ```
3. Reset ambulance availability:
   ```sql
   UPDATE ambulances SET is_available = true WHERE hospital_id = 'hospital-uuid';
   ```

---

## Development Issues

### ❌ "Nodemon not restarting"

**Solutions:**
1. Install nodemon globally:
   ```bash
   npm install -g nodemon
   ```
2. Use local nodemon:
   ```bash
   npx nodemon server/server.js
   ```
3. Manually restart server

---

### ❌ "React hot reload not working"

**Solutions:**
1. Check if FAST_REFRESH is enabled
2. Restart development server
3. Clear cache:
   ```bash
   rm -rf node_modules/.cache
   ```

---

## Deployment Issues

### ❌ "Heroku deployment failed"

**Solutions:**
1. Ensure `package.json` has start script:
   ```json
   "scripts": {
     "start": "node server/server.js"
   }
   ```
2. Set environment variables:
   ```bash
   heroku config:set JWT_SECRET=your_secret
   ```
3. Check Heroku logs:
   ```bash
   heroku logs --tail
   ```

---

### ❌ "Database migration failed on Heroku"

**Solutions:**
1. Run migration manually:
   ```bash
   heroku pg:psql < server/database/schema.sql
   ```
2. Or use Heroku console:
   ```bash
   heroku run bash
   psql $DATABASE_URL < server/database/schema.sql
   ```

---

## Testing Issues

### ❌ "API tests failing"

**Solutions:**
1. Ensure test database exists
2. Set NODE_ENV=test
3. Use separate test database:
   ```env
   DB_NAME=ambulance_booking_test
   ```
4. Clear test data between tests

---

## Logging & Debugging

### Enable Debug Logging

**Backend:**
```javascript
// Add to server.js
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body);
  next();
});
```

**Database:**
```javascript
// Add to db.js
pool.on('query', (query) => {
  console.log('QUERY:', query.text);
});
```

**Frontend:**
```javascript
// Add to api.js
axios.interceptors.request.use(config => {
  console.log('API Request:', config);
  return config;
});
```

---

## Getting More Help

### Check Logs

**Backend:**
- Terminal where `npm run server` is running
- Check for error stack traces

**Frontend:**
- Browser DevTools → Console
- Network tab for API calls

**Database:**
```bash
# PostgreSQL logs location
# Windows: C:\Program Files\PostgreSQL\14\data\log\
# Mac: /usr/local/var/log/postgresql/
# Linux: /var/log/postgresql/

tail -f /var/log/postgresql/postgresql-*.log
```

### Debug Mode

Run with debug output:
```bash
DEBUG=* npm run server
```

### Common Error Patterns

| Error Message | Likely Cause | Quick Fix |
|---------------|--------------|-----------|
| ECONNREFUSED | Service not running | Start the service |
| EADDRINUSE | Port in use | Change port or kill process |
| 401 Unauthorized | Missing/invalid token | Login again |
| 404 Not Found | Wrong endpoint/ID | Check API path |
| 500 Server Error | Backend issue | Check server logs |
| Network Error | Backend down | Start backend |

---

## Still Having Issues?

1. **Read error messages carefully** - they usually tell you what's wrong
2. **Check all services are running** - Database, Backend, Frontend
3. **Verify environment variables** - Especially database credentials
4. **Clear cache and reinstall** - `rm -rf node_modules && npm install`
5. **Check versions** - Node.js 14+, PostgreSQL 12+
6. **Review setup guide** - SETUP_GUIDE.md has detailed instructions

---

## Prevention Tips

1. **Always use .env file** - Never hardcode credentials
2. **Keep dependencies updated** - `npm outdated`
3. **Use version control** - Commit working code
4. **Test locally first** - Before deploying
5. **Read error messages** - They're usually helpful
6. **Check logs regularly** - Catch issues early
7. **Backup database** - Before major changes

---

**Remember:** Most issues are configuration-related. Double-check your `.env` file and ensure all services are running!
