import { MongoClient } from 'mongodb';
async function run() {
    const mainClient = new MongoClient('mongodb://localhost:27017/zppsu-cares');
    await mainClient.connect();
    const mainUsers = await mainClient.db().collection('users').find({}).toArray();
    console.log("MAIN USERS:");
    mainUsers.forEach(u => console.log(u.email, u.password));
    await mainClient.close();

    const adminClient = new MongoClient('mongodb://localhost:27017/zppsu-cares-admin');
    await adminClient.connect();
    const adminUsers = await adminClient.db().collection('users').find({}).toArray();
    console.log("ADMIN USERS:");
    adminUsers.forEach(u => console.log(u.email, u.password));
    await adminClient.close();
}
run().catch(console.dir);
