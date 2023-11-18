import express from 'express';

import { updateUser } from '../controllers/user.controller.js';
import { verifyToken } from '../middleware/verifyUser.js';

const router = express.Router();

// router.get('/', getUser);
router.post('/update/:id', verifyToken, updateUser);
// router.delete('/delete/:id', verifyToken, deleteUser);

export default router;
