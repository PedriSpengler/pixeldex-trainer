import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

/**
 * --- VALIDATION SCHEMA ---
 * Ensures that the Pokémon data being saved contains all required fields
 * and follows the correct data types.
 */
const favoriteSchema = z.object({
  pokemonId: z.number().int().positive(), // The ID from the PokeAPI
  name: z.string().max(100),
  types: z.array(z.string()),
  sprite: z.string().url(),
});

/**
 * --- GLOBAL MIDDLEWARE ---
 * Protects all routes within this router. 
 * Users must provide a valid JWT to access any of these endpoints.
 */
router.use(authenticateToken);

/**
 * GET /favorites
 * Retrieves all favorited Pokémon for the currently logged-in user.
 */
router.get('/', async (req: AuthRequest, res) => {
  try {
    // Queries the database for favorites belonging to the authenticated userId
    const favorites = await prisma.favorite.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' }, // Latest additions first
    });

    res.json(favorites);
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({ error: 'Failed to get favorites' });
  }
});

/**
 * POST /favorites
 * Saves a Pokémon to the user's favorites list.
 */
router.post('/', async (req: AuthRequest, res) => {
  try {
    // 1. Validate the body data
    const { pokemonId, name, types, sprite } = favoriteSchema.parse(req.body);

    // 2. Check for duplicates
    // Uses a unique compound index (userId + pokemonId) defined in the Prisma schema
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

    // 3. Create the record
    const favorite = await prisma.favorite.create({
      data: {
        pokemonId,
        name,
        types,
        sprite,
        userId: req.userId!, // Links the favorite to the current user
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

/**
 * DELETE /favorites/:id
 * Removes a Pokémon from the favorites list.
 */
router.delete('/:id', async (req: AuthRequest, res) => {
  try {
    const id = req.params.id as string;

    // 1. Verify ownership
    // Ensures the user can only delete favorites they actually own
    const favorite = await prisma.favorite.findFirst({
      where: {
        id,
        userId: req.userId,
      },
    });

    if (!favorite) {
      return res.status(404).json({ error: 'Favorite not found' });
    }

    // 2. Delete the record
    await prisma.favorite.delete({ where: { id } });

    res.json({ message: 'Removed from favorites' });
  } catch (error) {
    console.error('Delete favorite error:', error);
    res.status(500).json({ error: 'Failed to remove favorite' });
  }
});

export default router;