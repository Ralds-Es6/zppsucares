import { connectDB } from '../config/db';
import { syncFacultySeeder } from './syncSeeders';
import { config } from '../config';

const run = async () => {
    try {
        await connectDB();
        const { user, profile } = await syncFacultySeeder();
        console.log('Seeder Faculty details:');
        console.log(`Email: ${user.email}`);
        console.log(`Password: ${config.seeder.faculty.password}`);
        console.log(`Employee ID: ${profile.employeeId}`);
        process.exit(0);
    } catch (error) {
        console.error('Error seeding faculty:', error);
        process.exit(1);
    }
};

run();
