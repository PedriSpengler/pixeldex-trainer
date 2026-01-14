import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const router = Router();
const prisma = new PrismaClient();

/**
 * --- VALIDATION SCHEMAS ---
 * We use Zod to ensure the data sent by the frontend matches our requirements
 * before we even touch the database.
 */
const registerSchema = z.object({
  email: z.string().email().max(255),
  username: z.string().min(2).max(50),
  password: z.string().min(6).max(100),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

/**
 * POST /auth/register
 * Creates a new trainer account in the database.
 */
router.post('/register', async (req, res) => {
  try {
    // 1. Validate request body against schema
    const { email, username, password } = registerSchema.parse(req.body);

    // 2. Check if the email is already taken
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // 3. Hash the password (Never store plain-text passwords!)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create the user in the database
    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
      },
    });

    // 5. Generate a JWT token valid for 7 days
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    // 6. Respond with user data (excluding password) and the token
    res.status(201).json({
      user: { id: user.id, email: user.email, username: user.username },
      token,
    });
  } catch (error) {
    // Handle validation errors specifically
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: (error as any).errors[0].message });
    }
    console.error('Register error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

/**
 * POST /auth/login
 * Verifies credentials and issues a new JWT token.
 */
router.post('/login', async (req, res) => {
  try {
    // 1. Validate input
    const { email, password } = loginSchema.parse(req.body);

    // 2. Find the user by email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // 3. Compare the provided password with the hashed password in the DB
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // 4. Issue a new JWT token
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
      return res.status(400).json({ error: (error as any).errors[0].message });
    }
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

export default router;