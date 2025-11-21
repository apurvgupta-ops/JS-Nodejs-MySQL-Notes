# Day 5: Error Handling & Logging

## Error Handling Patterns

### 1. Custom Error Classes
```javascript
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends AppError {
  constructor(message) {
    super(message, 400);
  }
}

class NotFoundError extends AppError {
  constructor(resource) {
    super(`${resource} not found`, 404);
  }
}

class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401);
  }
}
```

### 2. Async Error Wrapper
```javascript
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Usage
router.get('/users/:id', asyncHandler(async (req, res) => {
  const user = await userService.getUser(req.params.id);
  res.json(user);
}));
```

### 3. Global Error Handler
```javascript
// middlewares/errorHandler.js
const errorHandler = (err, req, res, next) => {
  // Log error
  logger.error(err);
  
  // Default to 500
  const statusCode = err.statusCode || 500;
  const message = err.isOperational ? err.message : 'Internal Server Error';
  
  res.status(statusCode).json({
    success: false,
    error: {
      message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
};
```

### 4. Winston Logger Setup
```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});

// Usage
logger.info('User created', { userId: 123 });
logger.error('Database error', { error: err.message });
```

### 5. Request Logger Middleware
```javascript
const morgan = require('morgan');

// Custom format
morgan.token('user-id', (req) => req.user?.id || 'anonymous');

app.use(morgan(':method :url :status :response-time ms - user: :user-id'));
```

---

## Best Practices

1. **Always use try-catch** in async functions
2. **Create specific error classes** for different scenarios
3. **Log errors with context** (user ID, request ID, etc.)
4. **Never expose stack traces** in production
5. **Use error codes** for client-side handling
6. **Implement retry logic** for transient failures
7. **Monitor error rates** and set up alerts
