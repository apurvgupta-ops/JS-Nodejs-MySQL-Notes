# Day 46: Authentication Across Services

## 📚 Table of Contents
1. Distributed Authentication Challenges
2. JWT Tokens
3. Opaque Tokens
4. Service-to-Service Authentication
5. Token Refresh Strategy
6. Authorization Across Services

---

## 1. Distributed Authentication Challenges

### Problems in Microservices

```
❌ How to verify user identity across services?
❌ How to share session data?
❌ How to handle token validation?
❌ How to manage service-to-service calls?
❌ How to revoke access?
```

### Solutions

```
✅ JWT (Stateless)       - Self-contained tokens
✅ Opaque Tokens (Stateful) - Centralized validation
✅ API Keys              - Service-to-service
✅ mTLS                  - Certificate-based auth
```

---

## 2. JWT Tokens

### JWT Structure

```
Header.Payload.Signature

Header: { "alg": "HS256", "typ": "JWT" }
Payload: { "userId": "123", "role": "admin", "exp": 1234567890 }
Signature: HMACSHA256(base64(header) + "." + base64(payload), secret)
```

### Implementing JWT Authentication

```typescript
// auth-service/src/index.ts
import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = '15m';
const REFRESH_TOKEN_EXPIRES_IN = '7d';

app.use(express.json());

// Login endpoint
app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate access token
    const accessToken = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Generate refresh token
    const refreshToken = jwt.sign(
      { userId: user.id },
      JWT_SECRET,
      { expiresIn: REFRESH_TOKEN_EXPIRES_IN }
    );

    // Store refresh token
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    });

    res.json({
      accessToken,
      refreshToken,
      expiresIn: 900 // 15 minutes in seconds
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// Token validation endpoint (for other services)
app.post('/auth/validate', (req, res) => {
  try {
    const { token } = req.body;
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ valid: true, user: decoded });
  } catch (error) {
    res.status(401).json({ valid: false, error: 'Invalid token' });
  }
});

// Refresh token endpoint
app.post('/auth/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, JWT_SECRET) as any;

    // Check if refresh token exists in database
    const storedToken = await prisma.refreshToken.findFirst({
      where: {
        token: refreshToken,
        userId: decoded.userId,
        revoked: false,
        expiresAt: { gt: new Date() }
      }
    });

    if (!storedToken) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    // Generate new access token
    const accessToken = jwt.sign(
      {
        userId: user!.id,
        email: user!.email,
        role: user!.role
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({ accessToken });
  } catch (error) {
    res.status(401).json({ error: 'Token refresh failed' });
  }
});

app.listen(3005, () => {
  console.log('Auth service running on port 3005');
});
```

### JWT Middleware for Services

```typescript
// lib/authMiddleware.ts
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const JWT_SECRET = process.env.JWT_SECRET!;

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    (req as any).user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

export function authorize(roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (!user || !roles.includes(user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
}
```

```typescript
// services/orders/src/index.ts
import { authenticate, authorize } from './lib/authMiddleware';

app.get('/orders', authenticate, async (req, res) => {
  const userId = (req as any).user.userId;
  const orders = await prisma.order.findMany({ where: { userId } });
  res.json(orders);
});

app.delete('/orders/:id', authenticate, authorize(['admin']), async (req, res) => {
  await prisma.order.delete({ where: { id: req.params.id } });
  res.json({ success: true });
});
```

### JWT Pros & Cons

**Pros:**
- ✅ Stateless (no database lookup)
- ✅ Can be validated independently by each service
- ✅ Contains user information
- ✅ Can't be modified without signature

**Cons:**
- ❌ Can't be revoked before expiration
- ❌ Large size (sent with every request)
- ❌ All services need shared secret
- ❌ Payload visible (base64 encoded, not encrypted)

---

## 3. Opaque Tokens

### What are Opaque Tokens?

Random strings that require centralized validation.

```
Token: "a1b2c3d4e5f6g7h8i9j0"
→ Auth Service validates → Returns user info
```

### Implementing Opaque Tokens

```typescript
// auth-service/src/index.ts
import crypto from 'crypto';

// Login with opaque token
app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !await bcrypt.compare(password, user.password)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Generate opaque token
  const token = crypto.randomBytes(32).toString('hex');

  // Store in database or Redis
  await redis.setex(
    `token:${token}`,
    900, // 15 minutes
    JSON.stringify({
      userId: user.id,
      email: user.email,
      role: user.role
    })
  );

  res.json({ token });
});

// Validate token (called by other services)
app.post('/auth/validate', async (req, res) => {
  const { token } = req.body;

  const userData = await redis.get(`token:${token}`);
  
  if (!userData) {
    return res.status(401).json({ valid: false });
  }

  res.json({
    valid: true,
    user: JSON.parse(userData)
  });
});

// Revoke token (logout)
app.post('/auth/logout', async (req, res) => {
  const { token } = req.body;
  await redis.del(`token:${token}`);
  res.json({ success: true });
});
```

### Validation Middleware

```typescript
// lib/opaqueAuthMiddleware.ts
import axios from 'axios';

export function authenticateOpaque(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  // Validate with auth service
  axios.post('http://auth-service:3005/auth/validate', { token })
    .then(response => {
      if (response.data.valid) {
        (req as any).user = response.data.user;
        next();
      } else {
        res.status(401).json({ error: 'Invalid token' });
      }
    })
    .catch(() => {
      res.status(401).json({ error: 'Token validation failed' });
    });
}
```

### Opaque Tokens Pros & Cons

**Pros:**
- ✅ Can be revoked immediately
- ✅ Small size
- ✅ Centralized control
- ✅ No shared secrets needed

**Cons:**
- ❌ Requires database/Redis lookup (slower)
- ❌ Network call to auth service
- ❌ Single point of failure
- ❌ More complex

---

## 4. Service-to-Service Authentication

### API Keys

```typescript
// lib/serviceAuth.ts
const SERVICE_API_KEYS = new Map([
  ['users-service', process.env.USERS_SERVICE_KEY!],
  ['orders-service', process.env.ORDERS_SERVICE_KEY!],
  ['payments-service', process.env.PAYMENTS_SERVICE_KEY!]
]);

export function authenticateService(req: Request, res: Response, next: NextFunction) {
  const apiKey = req.headers['x-api-key'] as string;
  const serviceName = req.headers['x-service-name'] as string;

  if (!apiKey || !serviceName) {
    return res.status(401).json({ error: 'Missing credentials' });
  }

  const expectedKey = SERVICE_API_KEYS.get(serviceName);
  
  if (!expectedKey || apiKey !== expectedKey) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  (req as any).service = serviceName;
  next();
}
```

```typescript
// services/orders/src/index.ts
import axios from 'axios';

// Call Users service with API key
async function getUserDetails(userId: string) {
  const response = await axios.get(
    `http://users-service:3001/users/${userId}`,
    {
      headers: {
        'X-API-Key': process.env.ORDERS_SERVICE_KEY!,
        'X-Service-Name': 'orders-service'
      }
    }
  );
  return response.data;
}
```

### mTLS (Mutual TLS)

Certificate-based authentication.

```typescript
// lib/mtls.ts
import https from 'https';
import fs from 'fs';

// Server with client cert verification
const server = https.createServer(
  {
    cert: fs.readFileSync('server-cert.pem'),
    key: fs.readFileSync('server-key.pem'),
    ca: fs.readFileSync('ca-cert.pem'),
    requestCert: true,
    rejectUnauthorized: true
  },
  app
);

server.listen(3001);
```

```typescript
// Client with certificate
const agent = new https.Agent({
  cert: fs.readFileSync('client-cert.pem'),
  key: fs.readFileSync('client-key.pem'),
  ca: fs.readFileSync('ca-cert.pem')
});

axios.get('https://users-service:3001/users/123', { httpsAgent: agent });
```

---

## 5. Token Refresh Strategy

### Sliding Sessions

```typescript
// Refresh token on every request if near expiration
export function autoRefresh(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      const expiresIn = decoded.exp - Math.floor(Date.now() / 1000);
      
      // If expiring in less than 5 minutes, refresh
      if (expiresIn < 300) {
        const newToken = jwt.sign(
          {
            userId: decoded.userId,
            email: decoded.email,
            role: decoded.role
          },
          JWT_SECRET,
          { expiresIn: '15m' }
        );
        
        res.setHeader('X-New-Token', newToken);
      }
    } catch (error) {
      // Token invalid, let auth middleware handle it
    }
  }
  
  next();
}
```

### Token Rotation

```typescript
// On refresh, invalidate old refresh token and issue new one
app.post('/auth/refresh', async (req, res) => {
  const { refreshToken } = req.body;
  
  const decoded = jwt.verify(refreshToken, JWT_SECRET) as any;
  
  // Invalidate old refresh token
  await prisma.refreshToken.update({
    where: { token: refreshToken },
    data: { revoked: true }
  });
  
  // Generate new tokens
  const newAccessToken = jwt.sign({ userId: decoded.userId }, JWT_SECRET, { expiresIn: '15m' });
  const newRefreshToken = jwt.sign({ userId: decoded.userId }, JWT_SECRET, { expiresIn: '7d' });
  
  // Store new refresh token
  await prisma.refreshToken.create({
    data: {
      token: newRefreshToken,
      userId: decoded.userId,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    }
  });
  
  res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
});
```

---

## 6. Authorization Across Services

### Role-Based Access Control (RBAC)

```typescript
// auth-service/prisma/schema.prisma
model User {
  id    String @id @default(cuid())
  email String @unique
  roles Role[]
}

model Role {
  id          String       @id @default(cuid())
  name        String       @unique
  permissions Permission[]
  users       User[]
}

model Permission {
  id       String @id @default(cuid())
  resource String
  action   String
  roles    Role[]
}
```

```typescript
// lib/rbac.ts
export class RBAC {
  private permissions = new Map<string, Set<string>>();

  constructor() {
    // Load permissions
    this.permissions.set('admin', new Set([
      'orders:read',
      'orders:write',
      'orders:delete',
      'users:read',
      'users:write'
    ]));
    
    this.permissions.set('user', new Set([
      'orders:read',
      'orders:write',
      'users:read'
    ]));
  }

  can(role: string, permission: string): boolean {
    return this.permissions.get(role)?.has(permission) || false;
  }
}

export const rbac = new RBAC();

export function requirePermission(permission: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    
    if (!user || !rbac.can(user.role, permission)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    
    next();
  };
}
```

```typescript
// Usage
app.delete('/orders/:id', authenticate, requirePermission('orders:delete'), async (req, res) => {
  await prisma.order.delete({ where: { id: req.params.id } });
  res.json({ success: true });
});
```

---

## 📝 Practice Tasks

### Task 1: JWT Authentication
- Implement auth service with login/logout
- Add JWT middleware to services
- Implement token refresh

### Task 2: Opaque Tokens
- Implement opaque token system with Redis
- Add token validation endpoint
- Implement immediate revocation

### Task 3: Service-to-Service Auth
- Implement API key authentication
- Add service authentication middleware
- Secure inter-service communication

---

## 🔗 Quick Reference

| Method       | Pros            | Cons            | Best For             |
| ------------ | --------------- | --------------- | -------------------- |
| **JWT**      | Stateless, fast | Can't revoke    | High performance     |
| **Opaque**   | Revocable       | Requires lookup | Sensitive operations |
| **API Keys** | Simple          | Less secure     | Service-to-service   |
| **mTLS**     | Very secure     | Complex setup   | High security needs  |

**Next:** Day 47 - Observability
