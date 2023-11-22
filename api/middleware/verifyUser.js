import jwt from 'jsonwebtoken';
import { errorHandler } from '../lib/error.js';

export function verifyToken(req, res, next) {
  console.log(req.cookies);
  const token = req.cookies.access_token;

  console.log('TOKEN:', token);

  if (!token) {
    // return res.status(401), json('You are not authenticated!');
    return next(errorHandler(401, 'You are not authenticated'));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      // return res.status(403).json('Token is not valid');
      return next(errorHandler(403, 'Token is not valid!'));
    }

    // The user will be added to the req object and will be available to the next function updateUser
    req.user = user;
    next();
  });
}
