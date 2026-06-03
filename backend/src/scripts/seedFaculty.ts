import mongoose from 'mongoose';
import { MainUser } from '../models/DatabaseRouter';
import { UserRole } from '../models/UserModel';
import { Faculty } from '../models/FacultyModel';
import { connectDB } from '../config/db';
import dotenv from 'dotenv';
dotenv.config();

const createFaculty = async () => {
    try {
        await connectDB();

        console.log('Checking for existing faculty...');
        const facultyExists = await MainUser.findOne({ email: 'faculty@zppsu.edu.ph' });

        if (facultyExists) {
            console.log('Faculty already exists.');
            process.exit(0);
        }

        console.log('Creating Faculty Account...');
        const newFacultyUser = await MainUser.create({
            firstName: 'Ricardo',
            lastName: 'Dalisay',
            email: 'faculty@zppsu.edu.ph',
            password: 'FacultyPassword123!',
            role: UserRole.FACULTY,
            isActive: true,
        });

        // Create Faculty Profile
        const facultyProfile = await Faculty.create({
            user: newFacultyUser._id,
            employeeId: 'FAC-2023-001',
            department: 'Engineering',
            designation: 'Department Head'
        });

        // Link profile to user
        newFacultyUser.facultyProfile = facultyProfile._id as any;
        await newFacultyUser.save();

        console.log('Faculty account created successfully:');
        console.log(`Email: ${newFacultyUser.email}`);
        console.log(`Password: FacultyPassword123!`);
        console.log(`Employee ID: ${facultyProfile.employeeId}`);

        process.exit(0);
    } catch (error) {
        console.error('Error creating faculty:', error);
        process.exit(1);
    }
};

createFaculty();
