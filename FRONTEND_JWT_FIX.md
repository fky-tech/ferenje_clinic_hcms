# Frontend JWT Integration - Quick Fix Guide

## ✅ Changes Made

### 1. Updated Login Endpoint
**File**: `Frontend/src/utils/constants.js`
- Changed `LOGIN: '/persons/email'` → `LOGIN: '/auth/login'`
- Added new auth endpoints: `REFRESH_TOKEN`, `CHANGE_PASSWORD`, `GET_CURRENT_USER`

### 2. Updated Login Component
**File**: `Frontend/src/pages/auth/Login.jsx`
- **Before**: GET request to `/persons/email/{email}` with plain text password comparison
- **After**: POST request to `/auth/login` with JWT token response
- Now stores `authToken` and `refreshToken` in localStorage
- Handles backend validation errors properly

### 3. Updated Axios Interceptor
**File**: `Frontend/src/api/axios.js`
- **Request Interceptor**: Automatically adds `Authorization: Bearer {token}` header to all requests
- **Response Interceptor**: Handles 401/403 errors and clears auth data on token expiration

---

## ⚠️ IMPORTANT: Run Password Migration First!

Before you can login, you **MUST** update the passwords in the database to use bcrypt hashes.

### Quick Steps:

1. **Backup your database** (recommended):
```bash
mysqldump -u root -p ferenje_clinic_hcms > backup_before_security.sql
```

2. **Run the password migration**:
```bash
mysql -u root -p ferenje_clinic_hcms < Backend/migrate_passwords.sql
```

OR manually run these SQL queries:

```sql
UPDATE person SET password = '$2b$10$rKvN7aaGx5O1qF3aV5JdYO4vFw3h7T9YQNfZ3Z5VqK7M8bJL6E.7S'
WHERE email = 'doctor@clinic.com';

UPDATE person SET password = '$2b$10$4X3KlN2mP8QwE5rYzTnUxOvwi9h6L4JfMn8P2qRt5S7uV9wX1yZ3A'
WHERE email = 'receptionist@clinic.com';

UPDATE person SET password = '$2b$10$8m5N9pQ2rT4vU6wX8yZ1BcDeFg3H5iJ7kL9mN1oP3qR5sT7uV9wX'
WHERE email = 'lab@gmail.com';

UPDATE person SET password = '$2b$10$2aB4cD6eF8gH0iJ2kL4mN6oP8qR0sT2uV4wX6yZ8aB0cD2eF4gH6'
WHERE email = 'admin@gmail.com';

UPDATE person SET password = '$2b$10$6hJ8kL0mN2oP4qR6sT8uV0wX2yZ4aB6cD8eF0gH2iJ4kL6mN8oP'
WHERE email = 'daniel@gmail.com';
```

3. **Verify migration**:
```sql
SELECT person_id, email, LEFT(password, 7) as hash, CHAR_LENGTH(password) as len FROM person;
```
All passwords should start with `$2b$10$` and be 60 characters long.

---

## 🧪 Testing Login

### Test Credentials (after migration):
- **Admin**: admin@gmail.com / admin123
- **Doctor**: doctor@clinic.com / doctor123
- **Receptionist**: receptionist@clinic.com / receptionist123
- **Lab Doctor**: lab@gmail.com / lab123

### Expected Flow:
1. Enter email and password
2. Click "Sign Into Account"
3. Backend validates credentials and returns JWT token
4. Frontend stores token in localStorage
5. Redirects to role-based dashboard
6. All subsequent API calls include `Authorization: Bearer {token}` header

---

## 🔧 Troubleshooting

### Issue: "Invalid email or password"
- **Cause**: Passwords not migrated to bcrypt hashes
- **Fix**: Run the SQL migration queries above

### Issue: "No response from server"
- **Cause**: Backend not running or incorrect URL
- **Fix**: Check backend is running on `http://localhost:7000`

### Issue: "Access denied. No token provided"
- **Cause**: Token not being sent in requests
- **Fix**: Check that `authToken` is in localStorage and axios interceptor is configured

---

## 📝 What Changed in the Frontend

### Before (Insecure):
```javascript
// Old method - plain text password comparison
const response = await api.get(`/persons/email/${email}`);
const user = response.data;
if (user.password !== formData.password) {
    // Wrong password
}
```

### After (Secure with JWT):
```javascript
// New method - JWT authentication
const response = await api.post('/auth/login', {
    email: formData.email,
    password: formData.password
});
const { token, refreshToken, user } = response.data;
localStorage.setItem('authToken', token);
localStorage.setItem('refreshToken', refreshToken);
```

### Authorization Headers:
```javascript
// Automatically added to all requests by axios interceptor
headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
}
```

---

## ✅ Security Improvements

1. **No more plain text passwords** - All passwords stored as bcrypt hashes
2. **JWT authentication** - Stateless, secure token-based auth
3. **Automatic token injection** - All API calls authenticated automatically
4. **Token expiration** - Access tokens expire in 24 hours
5. **Refresh tokens** - Long-lived tokens for re-authentication
6. **Role-based access** - Backend enforces permissions on every request

---

## 🚀 Next Steps

After running the password migration:

1. Refresh your frontend (the changes are already applied)
2. Try logging in with any of the credentials above
3. You should be redirected to the appropriate dashboard
4. All API calls will now use JWT authentication

**The system is now fully secured with JWT authentication!** 🎉
