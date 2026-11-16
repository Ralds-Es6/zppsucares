import { connectDB } from '../config/db';
import { syncAdminSeeder } from './syncSeeders';
import { config } from '../config';

const run = async () => {
    try {
        await connectDB();
        const admin = await syncAdminSeeder();
        console.log('Seeder Admin details:');
        console.log(`Email: ${admin.email}`);
        console.log(`Password: ${config.seeder.admin.password}`);
        process.exit(0);
    } catch (error) {
        console.error('Error seeding admin:', error);
        process.exit(1);
    }
};

run();
