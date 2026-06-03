import { MainUser } from '../models/DatabaseRouter';
import { Student } from '../models/StudentModel';
import { UserRole } from '../models/UserModel';
import { connectDB } from '../config/db';
import dotenv from 'dotenv';
dotenv.config();

const createStudent = async () => {
    try {
        await connectDB();

        const studentEmail = 'student@zppsu.edu.ph';
        console.log(`Checking for existing student: ${studentEmail}...`);

        const userExists = await MainUser.findOne({ email: studentEmail });

        if (userExists) {
            console.log('Student user already exists.');
            process.exit(0);
        }

        console.log('Creating Student User Account...');
        const newUser = await MainUser.create({
            firstName: 'Juan',
            lastName: 'Dela Cruz',
            email: studentEmail,
            password: 'StudentPassword123!',
            role: UserRole.STUDENT,
            isActive: true,
        });

        console.log('Creating Student Profile...');
        const newStudent = await Student.create({
            user: newUser._id,
            studentId: '2023-0001',
            course: 'BS Information Technology',
            yearLevel: 3,
            section: 'A',
        });

        // Link profile back to user
        newUser.studentProfile = newStudent._id as any;
        await newUser.save();

        console.log('Student account created successfully:');
        console.log(`Email: ${newUser.email}`);
        console.log(`Password: StudentPassword123!`);
        console.log(`Student ID: ${newStudent.studentId}`);

        process.exit(0);
    } catch (error) {
        console.error('Error creating student:', error);
        process.exit(1);
    }
};

createStudent();
