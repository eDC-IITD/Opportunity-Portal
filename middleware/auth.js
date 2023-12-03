import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { request } from 'express';

dotenv.config();

// Your secret key for signing and verifying JWTs
const secretKey = process.env.JWT_SECRET;

const authenticationMiddleware = (req, res, next) => {
  // Check if the Authorization header is present in the request
  if (req.method === 'GET') return next();
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ message: 'Unauthorized - No token provided' });

  // Verify and decode the token
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized - Invalid token' });
    }
    req.user = decoded;

    next();
  });
};
// };

export { authenticationMiddleware };
