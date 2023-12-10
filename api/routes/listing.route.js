import express from 'express';
import {
  createListing,
  deleteListing,
  updateListing,
  getListing,
} from '../controllers/listing.controller.js';
import { verifyToken } from '../middleware/verifyUser.js';

const router = express.Router();

router.post('/create', createListing);
router.delete('/delete/:id', verifyToken, deleteListing);
router.patch('/update/:id', verifyToken, updateListing);
router.get('/get/:id', getListing);

export default router;
