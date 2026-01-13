# Backend Code for Pokedex API

This is the full backend code you can run locally with Node.js, Express, and PostgreSQL.

## Setup Instructions

1. Create a new folder and initialize:
```bash
mkdir pokedex-backend && cd pokedex-backend
npm init -y
npm install express cors dotenv jsonwebtoken bcryptjs @prisma/client
npm install -D prisma typescript @types/node @types/express @types/cors @types/jsonwebtoken @types/bcryptjs ts-node nodemon
npx prisma init
```

2. Create `.env` file:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/pokedex_db"
JWT_SECRET="your-super-secret-key-change-in-production"
PORT=3001
```

3. Update `prisma/schema.prisma`:
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String     @id @default(uuid())
  email     String     @unique
  username  String
  password  String
  createdAt DateTime   @default(now())
  favorites Favorite[]
}

model Favorite {
  id        String   @id @default(uuid())
  pokemonId Int
  name      String
  types     String[]
  sprite    String
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())

  @@unique([userId, pokemonId])
}
```

4. Run migrations:
```bash
npx prisma migrate dev --name init
npx prisma generate
```

## Server Code

### src/server.ts
```typescript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import favoritesRoutes from './routes/favorites';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: 'http://localhost:5173', // Vite dev server
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/favorites', favoritesRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
```

### src/middleware/auth.ts
```typescript
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  userId?: string;
}

export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};
```

### src/routes/auth.ts
```typescript
import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const router = Router();
const prisma = new PrismaClient();

const registerSchema = z.object({
  email: z.string().email().max(255),
  username: z.string().min(2).max(50),
  password: z.string().min(6).max(100),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// POST /auth/register
router.post('/register', async (req, res) => {
  try {
    const { email, username, password } = registerSchema.parse(req.body);

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
      },
    });

    // Generate token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      user: { id: user.id, email: user.email, username: user.username },
      token,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error('Register error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// POST /auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    res.json({
      user: { id: user.id, email: user.email, username: user.username },
      token,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

export default router;
```

### src/routes/favorites.ts
```typescript
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

const favoriteSchema = z.object({
  pokemonId: z.number().int().positive(),
  name: z.string().max(100),
  types: z.array(z.string()),
  sprite: z.string().url(),
});

// All routes require authentication
router.use(authenticateToken);

// GET /favorites - Get all favorites for logged in user
router.get('/', async (req: AuthRequest, res) => {
  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' },
    });

    res.json(favorites);
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({ error: 'Failed to get favorites' });
  }
});

// POST /favorites - Add a pokemon to favorites
router.post('/', async (req: AuthRequest, res) => {
  try {
    const { pokemonId, name, types, sprite } = favoriteSchema.parse(req.body);

    // Check if already favorited
    const existing = await prisma.favorite.findUnique({
      where: {
        userId_pokemonId: {
          userId: req.userId!,
          pokemonId,
        },
      },
    });

    if (existing) {
      return res.status(400).json({ error: 'Pokemon already in favorites' });
    }

    const favorite = await prisma.favorite.create({
      data: {
        pokemonId,
        name,
        types,
        sprite,
        userId: req.userId!,
      },
    });

    res.status(201).json(favorite);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error('Add favorite error:', error);
    res.status(500).json({ error: 'Failed to add favorite' });
  }
});

// DELETE /favorites/:id - Remove from favorites
router.delete('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    // Find the favorite
    const favorite = await prisma.favorite.findFirst({
      where: {
        id,
        userId: req.userId,
      },
    });

    if (!favorite) {
      return res.status(404).json({ error: 'Favorite not found' });
    }

    await prisma.favorite.delete({ where: { id } });

    res.json({ message: 'Removed from favorites' });
  } catch (error) {
    console.error('Delete favorite error:', error);
    res.status(500).json({ error: 'Failed to remove favorite' });
  }
});

export default router;
```

### package.json scripts
```json
{
  "scripts": {
    "dev": "nodemon --exec ts-node src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js"
  }
}
```

### tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

## Run the backend
```bash
npm run dev
```

The API will be available at `http://localhost:3001`

## Connecting Frontend to Backend

To connect the React frontend to this backend, update the API calls in the contexts:

1. Replace localStorage mock in AuthContext with axios calls to `/auth/login` and `/auth/register`
2. Replace localStorage mock in FavoritesContext with axios calls to `/favorites`
3. Store the JWT token from login response and send it as `Authorization: Bearer <token>` header
