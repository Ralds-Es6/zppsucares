import app from './app';
import { config } from './config';
import { connectDB } from './config/db';
import { syncAllSeeders } from './scripts/syncSeeders';

const PORT = config.port;

// Connect to database before starting server
connectDB().then(async () => {
    try {
        await syncAllSeeders();
    } catch (error) {
        console.error('Error synchronizing seeders on server startup:', error);
    }

    app.listen(PORT, () => {
        console.log(`Server is running in ${config.nodeEnv} mode on port ${PORT}`);
    });
});
