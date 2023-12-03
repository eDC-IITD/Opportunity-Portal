import jwt from 'jsonwebtoken';
import { CONFIG } from '../config';

// Your secret key for signing and verifying JWTs
const secretKey = CONFIG.JWT_SECRET_KEY;

const authenticationMiddleware = (req, res, next) => {
  // Check if the Authorization header is present in the request
  // if (req.method === 'GET') return next();

  const token = req.headers.authorization.split(' ')[1];
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

export { authenticationMiddleware };
