import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

async function test() {
    console.log("Connecting...");
    const conn = await mongoose.createConnection('mongodb://localhost:27017/zppsu-cares').asPromise();
    const adminConn = await mongoose.createConnection('mongodb://localhost:27017/zppsu-cares-admin').asPromise();
    
    const users = await conn.collection('users').find({}).toArray();
    console.log("Main users:");
    for (const u of users) {
        console.log("User:", u.email, "Password hash:", u.password);
        if (u.email === 'student@zppsu.edu.ph') {
            const match = await bcrypt.compare('StudentPassword123!', u.password);
            console.log("Student password match?", match);
        }
        if (u.email === 'faculty') {
            const match = await bcrypt.compare('FacultyPassword123!', u.password);
            console.log("Faculty password match?", match);
        }
    }
    
    const adminUsers = await adminConn.collection('users').find({}).toArray();
    console.log("Admin users:");
    for (const u of adminUsers) {
        console.log("Admin:", u.email, "Password hash:", u.password);
        if (u.email === 'admin@zppsu.edu.ph') {
            const match = await bcrypt.compare('AdminPassword123!', u.password);
            console.log("Admin password match?", match);
        }
    }
    
    await conn.close();
    await adminConn.close();
}
test().catch(console.error);
