import mongoose from 'mongoose';

const treeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    earnedMonth: {
        type: Number,
        required: true
    },
    earnedYear: {
        type: Number,
        required: true
    },
    health: {
        type: String,
        enum: ['healthy', 'neutral', 'unhealthy'],
        default: 'healthy'
    },
    species: {
        type: String,
        default: 'oak'
    }
}, { timestamps: true });

export default mongoose.model('Tree', treeSchema);
