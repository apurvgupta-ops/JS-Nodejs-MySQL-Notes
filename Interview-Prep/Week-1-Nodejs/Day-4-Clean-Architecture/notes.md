# Day 4: Clean Architecture & Layered Design

## 📚 Overview

Clean Architecture separates business logic from external concerns, making code:
- **Testable**: Easy to unit test
- **Maintainable**: Changes isolated to specific layers
- **Scalable**: Add features without breaking existing code
- **Framework Independent**: Not tied to Express, database, etc.

---

## Layered Architecture

```
┌─────────────────────────────────────┐
│         Controllers (API Layer)      │  ← HTTP, validation
├─────────────────────────────────────┤
│         Services (Business Logic)    │  ← Core business rules
├─────────────────────────────────────┤
│    Repositories (Data Access)        │  ← Database operations
├─────────────────────────────────────┤
│         Models/Entities              │  ← Data structures
└─────────────────────────────────────┘
```

### 1. Controllers
- Handle HTTP requests/responses
- Validate input
- Call services
- Return formatted responses

```javascript
// controllers/userController.js
class UserController {
  constructor(userService) {
    this.userService = userService;
  }
  
  async createUser(req, res, next) {
    try {
      const userData = req.body;
      const user = await this.userService.createUser(userData);
      res.status(201).json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  }
  
  async getUser(req, res, next) {
    try {
      const { id } = req.params;
      const user = await this.userService.getUserById(id);
      res.json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  }
}
```

### 2. Services (Business Logic)
- Core business rules
- Coordinate between repositories
- Transaction management
- No HTTP knowledge

```javascript
// services/userService.js
class UserService {
  constructor(userRepository, emailService) {
    this.userRepository = userRepository;
    this.emailService = emailService;
  }
  
  async createUser(userData) {
    // Business logic
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('User already exists');
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    // Create user
    const user = await this.userRepository.create({
      ...userData,
      password: hashedPassword
    });
    
    // Send welcome email
    await this.emailService.sendWelcome(user.email);
    
    return user;
  }
  
  async getUserById(id) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
}
```

### 3. Repositories (Data Access)
- Database operations
- Query building
- No business logic

```javascript
// repositories/userRepository.js
class UserRepository {
  constructor(database) {
    this.db = database;
  }
  
  async create(userData) {
    const result = await this.db.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [userData.name, userData.email, userData.password]
    );
    return { id: result.insertId, ...userData };
  }
  
  async findById(id) {
    const [user] = await this.db.query(
      'SELECT * FROM users WHERE id = ?',
      [id]
    );
    return user;
  }
  
  async findByEmail(email) {
    const [user] = await this.db.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return user;
  }
  
  async update(id, userData) {
    await this.db.query(
      'UPDATE users SET name = ?, email = ? WHERE id = ?',
      [userData.name, userData.email, id]
    );
    return this.findById(id);
  }
  
  async delete(id) {
    await this.db.query('DELETE FROM users WHERE id = ?', [id]);
  }
}
```

### 4. Models/Entities
- Data structures
- Validation rules
- No database logic

```javascript
// models/User.js
class User {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.createdAt = data.createdAt;
  }
  
  static validate(data) {
    const errors = [];
    
    if (!data.name || data.name.length < 2) {
      errors.push('Name must be at least 2 characters');
    }
    
    if (!data.email || !this.isValidEmail(data.email)) {
      errors.push('Valid email required');
    }
    
    if (!data.password || data.password.length < 8) {
      errors.push('Password must be at least 8 characters');
    }
    
    return errors;
  }
  
  static isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
  
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      createdAt: this.createdAt
    };
  }
}
```

---

## Folder Structure

```
src/
├── controllers/         # HTTP handlers
│   ├── userController.js
│   └── productController.js
├── services/           # Business logic
│   ├── userService.js
│   └── productService.js
├── repositories/       # Data access
│   ├── userRepository.js
│   └── productRepository.js
├── models/            # Entities
│   ├── User.js
│   └── Product.js
├── middlewares/       # Express middlewares
│   ├── auth.js
│   ├── validation.js
│   └── errorHandler.js
├── routes/            # API routes
│   ├── userRoutes.js
│   └── productRoutes.js
├── config/            # Configuration
│   ├── database.js
│   └── env.js
├── utils/             # Utilities
│   ├── logger.js
│   └── validators.js
├── validators/        # Input validation schemas
│   └── userValidator.js
└── app.js            # App initialization
```

---

## Dependency Injection

```javascript
// config/container.js
const UserRepository = require('../repositories/userRepository');
const UserService = require('../services/userService');
const UserController = require('../controllers/userController');
const EmailService = require('../services/emailService');
const database = require('./database');

class Container {
  constructor() {
    this._services = new Map();
  }
  
  register(name, factory) {
    this._services.set(name, factory);
  }
  
  get(name) {
    const factory = this._services.get(name);
    if (!factory) {
      throw new Error(`Service ${name} not found`);
    }
    return factory();
  }
}

const container = new Container();

// Register dependencies
container.register('database', () => database);

container.register('userRepository', () => {
  return new UserRepository(container.get('database'));
});

container.register('emailService', () => {
  return new EmailService();
});

container.register('userService', () => {
  return new UserService(
    container.get('userRepository'),
    container.get('emailService')
  );
});

container.register('userController', () => {
  return new UserController(container.get('userService'));
});

module.exports = container;
```

---

## Benefits of Clean Architecture

1. **Testability**: Mock dependencies easily
2. **Maintainability**: Change one layer without affecting others
3. **Flexibility**: Swap implementations (e.g., database)
4. **Reusability**: Services can be used by different controllers
5. **Clear Responsibilities**: Each layer has one job

---

## Example: Converting Legacy Code

### ❌ Bad (Monolithic)
```javascript
// Everything in one file
app.post('/users', async (req, res) => {
  const { name, email, password } = req.body;
  
  // Validation
  if (!email) return res.status(400).json({ error: 'Email required' });
  
  // Check if exists
  const existing = await db.query('SELECT * FROM users WHERE email = ?', [email]);
  if (existing.length) return res.status(400).json({ error: 'User exists' });
  
  // Hash password
  const hashed = await bcrypt.hash(password, 10);
  
  // Insert
  const result = await db.query(
    'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
    [name, email, hashed]
  );
  
  // Send email
  await sendEmail(email, 'Welcome!');
  
  res.json({ id: result.insertId, name, email });
});
```

### ✅ Good (Clean Architecture)
```javascript
// routes/userRoutes.js
router.post('/users',
  validateUser,
  (req, res, next) => userController.createUser(req, res, next)
);

// Controller delegates to service
// Service contains business logic
// Repository handles database
// Clean, testable, maintainable!
```

---

## Key Principles

1. **Separation of Concerns**: Each layer has one responsibility
2. **Dependency Inversion**: Depend on abstractions, not concretions
3. **Single Responsibility**: One reason to change
4. **Don't Repeat Yourself (DRY)**: Reuse code
5. **SOLID Principles**: Follow OOP best practices
