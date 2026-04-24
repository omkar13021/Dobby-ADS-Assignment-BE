import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable');
}

const DBConnection = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected!');
    } catch (err) {
        console.error('Connection error:', err);
        process.exit(1);
    }
}

export default DBConnection;