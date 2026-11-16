import { MainUser } from '../models/DatabaseRouter';
import { connectDB } from '../config/db';
import { config } from '../config';

const check = async () => {
    try {
        await connectDB();
        const studentEmail = config.seeder.student.email;
        const studentPassword = config.seeder.student.password;
        const user = await MainUser.findOne({ email: studentEmail }).select('+password');
        if (!user) {
            console.log(`User not found for email: ${studentEmail}`);
            process.exit(0);
        }
        console.log('User password hash:', user.password);
        const match = await user.matchPassword(studentPassword);
        console.log(`Password match with .env (${studentPassword}):`, match);
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
check();
