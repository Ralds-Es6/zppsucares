import { connectDB } from '../config/db';
import { syncStudentSeeder } from './syncSeeders';
import { config } from '../config';

const run = async () => {
    try {
        await connectDB();
        const { user, profile } = await syncStudentSeeder();
        console.log('Seeder Student details:');
        console.log(`Email: ${user.email}`);
        console.log(`Password: ${config.seeder.student.password}`);
        console.log(`Student ID: ${profile.studentId}`);
        process.exit(0);
    } catch (error) {
        console.error('Error seeding student:', error);
        process.exit(1);
    }
};

run();
