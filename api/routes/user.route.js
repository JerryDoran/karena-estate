import express from 'express';

import {
  updateUser,
  deleteUser,
  getUserListings,
} from '../controllers/user.controller.js';
import { verifyToken } from '../middleware/verifyUser.js';

const router = express.Router();

// router.get('/', getUser);
router.post('/update/:id', verifyToken, updateUser);
router.delete('/delete/:id', verifyToken, deleteUser);
router.get('/listings/:id', verifyToken, getUserListings);

export default router;
