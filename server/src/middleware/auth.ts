import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

/**
 * AuthRequest Interface
 * Extends the standard Express Request object to include a 'userId' property.
 * This allows us to pass the authenticated user's ID to the next function/controller.
 */
export interface AuthRequest extends Request {
  userId?: string;
}

/**
 * authenticateToken Middleware
 * Intercepts incoming requests to verify the presence and validity of a JWT.
 */
export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  // Extract the 'Authorization' header (Format: "Bearer <token>")
  const authHeader = req.headers['authorization'];
  
  // If header exists, split by space and take the second part (the token)
  const token = authHeader && authHeader.split(' ')[1];

  // 401 Unauthorized: No token was provided in the request
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    /**
     * Verify the token using the secret key stored in environment variables.
     * The '!' after JWT_SECRET tells TypeScript that we guarantee this variable exists.
     */
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };

    // Inject the decoded userId into the request object for use in subsequent routes
    req.userId = decoded.userId;

    // Proceed to the next middleware or the actual route handler
    next();
  } catch (error) {
    /**
     * 403 Forbidden: The token exists but is invalid (tampered with) 
     * or has already expired.
     */
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};