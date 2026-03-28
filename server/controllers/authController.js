import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const generateToken = (userId) => {
    return jwt.sign(
        { id: userId },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
};

// ─── Google Token Login (Frontend @react-oauth/google flow) ───────────────────
// Called by frontend with Google access_token → verifies with Google → saves user → returns JWT
export const googleTokenLogin = async (req, res) => {
    try {
        const { access_token } = req.body;
        if (!access_token) {
            return res.status(400).json({ success: false, message: 'access_token is required' });
        }

        // Verify token with Google's userinfo endpoint
        const googleRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: `Bearer ${access_token}` }
        });

        if (!googleRes.ok) {
            return res.status(401).json({ success: false, message: 'Invalid Google access token' });
        }

        const profile = await googleRes.json();
        // profile: { sub, name, email, picture }

        // Find or create user
        let user = await User.findOne({ googleId: profile.sub });

        if (!user) {
            // Check if manual account exists with same email
            user = await User.findOne({ email: profile.email });
            if (user) {
                user.googleId = profile.sub;
                if (!user.avatar) user.avatar = profile.picture;
                await user.save();
            } else {
                // New user
                user = await User.create({
                    googleId: profile.sub,
                    email:    profile.email,
                    username: profile.name,
                    avatar:   profile.picture,
                });
            }
        }

        const token = generateToken(user._id);

        // SYNC: Also ensure user exists in the Flask Gamification App
        try {
            await fetch(`${process.env.GAMIFICATION_URL}/api/users`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    username: user.username,
                    avatar_seed: Math.floor(Math.random() * 1000)
                })
            });
        } catch (syncErr) {
            console.warn('Flask sync failed (is Flask server running?):', syncErr.message);
        }

        res.json({
            success: true,
            token,
            user: {
                id:       user._id,
                username: user.username,
                email:    user.email,
                avatar:   user.avatar,
            }
        });
    } catch (err) {
        console.error('googleTokenLogin error:', err);
        res.status(500).json({ success: false, message: 'Server error during Google login' });
    }
};


// ─── Google OAuth Callback ────────────────────────────────────────────────────
export const googleCallback = (req, res) => {
    try {
        const token = generateToken(req.user._id);
        const user = {
            id:       req.user._id,
            username: req.user.username,
            email:    req.user.email,
            avatar:   req.user.avatar,
        };
        // Redirect to frontend /auth/success with token + user info
        const params = new URLSearchParams({
            token,
            username: user.username || '',
            email:    user.email || '',
            avatar:   user.avatar || '',
        });
        res.redirect(`${process.env.CLIENT_URL}/auth/success?${params.toString()}`);
    } catch (err) {
        console.error('googleCallback error:', err);
        res.redirect(`${process.env.CLIENT_URL}/login?error=server_error`);
    }
};

// ─── Manual Register ──────────────────────────────────────────────────────────
export const manualRegister = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        const exists = await User.findOne({ email });
        if (exists) {
            return res.status(409).json({ success: false, message: 'Email already registered' });
        }

        const user = await User.create({ username, email, password });
        const token = generateToken(user._id);

        // SYNC: Flask Gamification App
        try {
            await fetch(`${process.env.GAMIFICATION_URL}/api/users`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: user.username })
            });
        } catch (e) {}

        res.status(201).json({
            success: true,
            token,
            user: { id: user._id, username: user.username, email: user.email }
        });
    } catch (err) {
        console.error('manualRegister error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// ─── Manual Login ─────────────────────────────────────────────────────────────
export const manualLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password required' });
        }

        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const token = generateToken(user._id);

        // SYNC: Flask Gamification App
        try {
            await fetch(`${process.env.GAMIFICATION_URL}/api/users`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: user.username })
            });
        } catch (e) {}

        res.json({
            success: true,
            token,
            user: { id: user._id, username: user.username, email: user.email, avatar: user.avatar }
        });
    } catch (err) {
        console.error('manualLogin error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// ─── Get Current User ─────────────────────────────────────────────────────────
export const getMe = async (req, res) => {
    res.json({
        success: true,
        user: {
            id:       req.user._id,
            username: req.user.username,
            email:    req.user.email,
            avatar:   req.user.avatar,
        }
    });
};
