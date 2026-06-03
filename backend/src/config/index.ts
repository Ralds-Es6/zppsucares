import dotenv from 'dotenv';
dotenv.config();

export const config = {
    port: process.env.PORT || 5000,
    dbUrl: process.env.DATABASE_URL || 'mongodb://localhost:27017/zppsu-cares',
    adminDbUrl: process.env.ADMIN_DATABASE_URL || 'mongodb://localhost:27017/zppsu-cares-admin',
    jwtSecret: process.env.JWT_SECRET || 'fallback_secret',
    nodeEnv: process.env.NODE_ENV || 'development',
    allowedOrigins: process.env.ALLOWED_ORIGINS 
        ? process.env.ALLOWED_ORIGINS.split(',') 
        : [
            'http://localhost:5173',
            'http://localhost:3000',
            'https://zppsucares.site',
            'https://www.zppsucares.site'
          ]
};
