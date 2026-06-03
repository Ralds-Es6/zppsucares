import mongoose from 'mongoose';
import { MainUser, AdminUser } from '../models/DatabaseRouter';
import { UserRole } from '../models/UserModel';
import { connectDB } from '../config/db';
import dotenv from 'dotenv';
dotenv.config();

const createAdmin = async () => {
    try {
        await connectDB();

        console.log('Checking for existing admin...');
        const adminExists = await AdminUser.findOne({ email: 'admin@zppsu.edu.ph' });

        if (adminExists) {
            console.log('Admin already exists.');
            process.exit(0);
        }

        console.log('Creating Admin Account...');
        const newAdmin = await AdminUser.create({
            firstName: 'Super',
            lastName: 'Admin',
            email: 'admin@zppsu.edu.ph',
            password: 'AdminPassword123!', // This will be hashed by the pre-save hook
            role: UserRole.ADMIN,
            isActive: true,
        });

        console.log('Admin account created successfully:');
        console.log(`Email: ${newAdmin.email}`);
        console.log(`Password: AdminPassword123!`);

        process.exit(0);
    } catch (error) {
        console.error('Error creating admin:', error);
        process.exit(1);
    }
};

createAdmin();
