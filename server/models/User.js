import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        default: null   // null for Google-only users
    },
    googleId: {
        type: String,
        default: null
    },
    avatar: {
        type: String,
        default: null
    },
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, { timestamps: true });

// Hash password before saving (for manual register)
userSchema.pre('save', async function (next) {
    if (!this.isModified('password') || !this.password) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Compare password for manual login
userSchema.methods.comparePassword = async function (candidatePassword) {
    if (!this.password) return false;
    return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', userSchema);
