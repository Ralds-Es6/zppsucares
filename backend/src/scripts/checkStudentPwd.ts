import { MainUser } from '../models/DatabaseRouter';
import { connectDB } from '../config/db';
import dotenv from 'dotenv';
dotenv.config();

const check = async () => {
    try {
        await connectDB();
        const user = await MainUser.findOne({ email: 'student@zppsu.edu.ph' }).select('+password');
        if (!user) {
            console.log('User not found');
            process.exit(0);
        }
        console.log('User password hash:', user.password);
        const match = await user.matchPassword('StudentPassword123!');
        console.log('Password match:', match);
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
check();
