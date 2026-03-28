import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

async function sanitize() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const db = mongoose.connection.db;
        const collections = ['footprints', 'trees'];

        for (const colName of collections) {
            const col = db.collection(colName);
            const docs = await col.find({ userId: { $type: 'string' } }).toArray();
            console.log(`Sanitizing ${colName}: ${docs.length} docs`);
            
            for (const doc of docs) {
                if (doc.userId.length === 24) {
                    await col.updateOne(
                        { _id: doc._id },
                        { $set: { userId: new mongoose.Types.ObjectId(doc.userId) } }
                    );
                }
            }
        }
        console.log('Sanitization complete!');
        process.exit(0);
    } catch (err) {
        console.error('Error during sanitization:', err);
        process.exit(1);
    }
}

sanitize();
