# Day 6: Mini Project - Auth & CRUD API

## Project Structure
```
mini-project/
├── src/
│   ├── controllers/
│   │   ├── authController.js
│   │   └── userController.js
│   ├── services/
│   │   ├── authService.js
│   │   └── userService.js
│   ├── repositories/
│   │   └── userRepository.js
│   ├── middlewares/
│   │   ├── auth.js
│   │   ├── validation.js
│   │   └── errorHandler.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── userRoutes.js
│   ├── utils/
│   │   ├── logger.js
│   │   └── errors.js
│   ├── config/
│   │   ├── database.js
│   │   └── env.js
│   └── app.js
├── package.json
└── .env
```

## Features Checklist

- [ ] User Registration
- [ ] User Login (JWT)
- [ ] Protected Routes
- [ ] CRUD Operations
- [ ] Pagination
- [ ] Error Handling
- [ ] Logging (Winston)
- [ ] Input Validation
- [ ] Password Hashing (bcrypt)
- [ ] Clean Architecture

## API Endpoints

```
POST   /api/auth/register       - Register new user
POST   /api/auth/login          - Login user
GET    /api/users               - Get all users (paginated)
GET    /api/users/:id           - Get user by ID
PUT    /api/users/:id           - Update user
DELETE /api/users/:id           - Delete user
```

## Database Schema

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Getting Started

1. Set up MySQL database
2. Create `.env` file with configuration
3. Install dependencies: `npm install`
4. Run migrations (if using)
5. Start server: `npm start`

## Testing

```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'

# Get users (with token)
curl http://localhost:3000/api/users \
  -H "Authorization: Bearer <your-token>"
```
