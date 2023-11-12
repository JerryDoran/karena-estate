import express from 'express';
import { signOut, signUpWithGoogle, signin, signup } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/google', signUpWithGoogle);
router.get('/signout', signOut);

export default router;
