import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';
import dotenv from 'dotenv';
dotenv.config();

passport.use(new GoogleStrategy(
    {
        clientID:     process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL:  process.env.CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            // 1. Check if user already logged in with Google before
            let user = await User.findOne({ googleId: profile.id });
            if (user) return done(null, user);

            // 2. Check if email already exists (manual signup user)
            user = await User.findOne({ email: profile.emails[0].value });
            if (user) {
                // Link their Google ID to the existing account
                user.googleId = profile.id;
                if (!user.avatar && profile.photos?.[0]?.value) {
                    user.avatar = profile.photos[0].value;
                }
                await user.save();
                return done(null, user);
            }

            // 3. Create a brand new user
            user = await User.create({
                googleId: profile.id,
                email:    profile.emails[0].value,
                username: profile.displayName,
                avatar:   profile.photos?.[0]?.value || null,
            });

            return done(null, user);
        } catch (err) {
            console.error('Passport Google Strategy Error:', err);
            return done(err, null);
        }
    }
));

// Serialize: store user id in session (just for the OAuth redirect)
passport.serializeUser((user, done) => done(null, user._id.toString()));

// Deserialize: fetch user from DB using session id
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id).select('-password');
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});
