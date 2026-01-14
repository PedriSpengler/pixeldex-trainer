import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import favoritesRoutes from './routes/favorites';

// Load environment variables from a .env file into process.env
dotenv.config();

const app = express();

/**
 * Port Configuration:
 * Uses the PORT provided by the environment (e.g., in production) 
 * or defaults to 3001 for local development.
 */
const PORT = process.env.PORT || 3001;

/**
 * CORS (Cross-Origin Resource Sharing) Configuration:
 * This is vital for the frontend to communicate with the backend.
 * origin: Lists the allowed frontend URLs (Vite defaults to 5173).
 * credentials: True allows cookies and authorization headers to be sent.
 */
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:8080'], 
  credentials: true
}));

/**
 * Body Parser Middleware:
 * Allows the server to accept and parse JSON data in the request body (req.body).
 */
app.use(express.json());

/**
 * Route Mounting:
 * Separates code into logical modules.
 * /auth -> Handles Login and Registration
 * /favorites -> Handles User collection management
 */
app.use('/auth', authRoutes);
app.use('/favorites', favoritesRoutes);

/**
 * Health Check Endpoint:
 * A simple route used to verify if the server is alive and responding.
 * Commonly used by monitoring tools and cloud hosting services.
 */
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString() 
  });
});

/**
 * Server Startup:
 * Begins listening for incoming network requests.
 */
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});