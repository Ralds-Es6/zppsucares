import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { config } from '../config';

async function test() {
    console.log("Connecting...");
    const conn = await mongoose.createConnection(config.dbUrl).asPromise();
    const adminConn = await mongoose.createConnection(config.adminDbUrl).asPromise();
    
    const users = await conn.collection('users').find({}).toArray();
    console.log("Main users:");
    for (const u of users) {
        console.log("User:", u.email, "Role:", u.role, "SeederKey:", u.seederKey);
        if (u.email === config.seeder.student.email.toLowerCase() || u.seederKey === 'student') {
            const match = await bcrypt.compare(config.seeder.student.password, u.password);
            console.log(`Student (${u.email}) password match with .env?`, match);
        }
        if (u.email === config.seeder.faculty.email.toLowerCase() || u.seederKey === 'faculty') {
            const match = await bcrypt.compare(config.seeder.faculty.password, u.password);
            console.log(`Faculty (${u.email}) password match with .env?`, match);
        }
    }
    
    const adminUsers = await adminConn.collection('users').find({}).toArray();
    console.log("Admin users:");
    for (const u of adminUsers) {
        console.log("Admin:", u.email, "Role:", u.role, "SeederKey:", u.seederKey);
        if (u.email === config.seeder.admin.email.toLowerCase() || u.seederKey === 'admin') {
            const match = await bcrypt.compare(config.seeder.admin.password, u.password);
            console.log(`Admin (${u.email}) password match with .env?`, match);
        }
    }
    
    await conn.close();
    await adminConn.close();
}
test().catch(console.error);
