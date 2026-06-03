import app from './app';
import { config } from './config';
import { connectDB } from './config/db';

const PORT = config.port;

// Connect to database before starting server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running in ${config.nodeEnv} mode on port ${PORT}`);
    });
});
