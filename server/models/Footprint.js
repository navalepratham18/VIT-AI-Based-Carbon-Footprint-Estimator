import mongoose from 'mongoose';

const footprintSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    month: {
        type: Number,
        required: true,
        min: 1,
        max: 12
    },
    year: {
        type: Number,
        required: true
    },
    co2_kg: {
        type: Number,
        required: true,
        min: 0
    }
}, { timestamps: true });

// Ensure one entry per user per month
footprintSchema.index({ userId: 1, month: 1, year: 1 }, { unique: true });

export default mongoose.model('Footprint', footprintSchema);
