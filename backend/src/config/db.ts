import mongoose from 'mongoose';
import { config } from '../config';

// Create connection instances
export const mainDb = mongoose.createConnection(config.dbUrl);
export const adminDb = mongoose.createConnection(config.adminDbUrl);

export const connectDB = async () => {
    try {
        // Wait for both connections to establish
        await Promise.all([
            mainDb.asPromise(),
            adminDb.asPromise()
        ]);

        console.log(`Main MongoDB Connected (Faculty/Student): ${mainDb.host}`);
        console.log(`Admin MongoDB Connected: ${adminDb.host}`);
    } catch (error: any) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1);
    }
};
