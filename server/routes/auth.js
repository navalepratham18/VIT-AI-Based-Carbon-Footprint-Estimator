import express from 'express';
import passport from 'passport';
import {
    googleCallback,
    googleTokenLogin,
    manualRegister,
    manualLogin,
    getMe
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// ─── Google OAuth (Passport redirect flow) ───────────────────────────────────
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email'],
    prompt: 'select_account'
}));

router.get('/google/callback',
    passport.authenticate('google', {
        failureRedirect: `${process.env.CLIENT_URL}/login?error=google_failed`,
        session: true
    }),
    googleCallback
);

// ─── Google Token Flow (Frontend @react-oauth/google) ────────────────────────
// Frontend sends Google access_token → backend verifies, saves user, returns JWT
router.post('/google/token', googleTokenLogin);

router.get('/failure', (req, res) => {
    res.status(401).json({ success: false, message: 'Google authentication failed' });
});

// ─── Manual Auth ─────────────────────────────────────────────────────────────
router.post('/register', manualRegister);
router.post('/login',    manualLogin);

// ─── Protected ───────────────────────────────────────────────────────────────
router.get('/me', protect, getMe);

export default router;
