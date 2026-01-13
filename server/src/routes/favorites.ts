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
      return res.status(400).json({ error: (error as any).errors[0].message });
    }
    console.error('Add favorite error:', error);
    res.status(500).json({ error: 'Failed to add favorite' });
  }
});

// DELETE /favorites/:id - Remove from favorites
router.delete('/:id', async (req: AuthRequest, res) => {
  try {
    const id = req.params.id as string;

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