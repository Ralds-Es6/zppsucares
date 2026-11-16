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
          ],
    seeder: {
        admin: {
            firstName: process.env.SEEDER_ADMIN_FIRST_NAME || 'Super',
            lastName: process.env.SEEDER_ADMIN_LAST_NAME || 'Admin',
            email: process.env.SEEDER_ADMIN_EMAIL || 'admin@zppsu.edu.ph',
            password: process.env.SEEDER_ADMIN_PASSWORD || 'AdminPassword123!',
        },
        counselors: [
            {
                key: 'counselor-1',
                firstName: process.env.SEEDER_COUNSELOR_1_FIRST_NAME || 'Margie B.',
                lastName: process.env.SEEDER_COUNSELOR_1_LAST_NAME || 'Janda',
                email: process.env.SEEDER_COUNSELOR_1_EMAIL || 'margie.janda@zppsu.edu.ph',
                password: process.env.SEEDER_COUNSELOR_1_PASSWORD || 'CounselorPassword123!',
            },
            {
                key: 'counselor-2',
                firstName: process.env.SEEDER_COUNSELOR_2_FIRST_NAME || 'Janet',
                lastName: process.env.SEEDER_COUNSELOR_2_LAST_NAME || 'Pangilinan',
                email: process.env.SEEDER_COUNSELOR_2_EMAIL || 'janet.pangilinan@zppsu.edu.ph',
                password: process.env.SEEDER_COUNSELOR_2_PASSWORD || 'CounselorPassword123!',
            },
            {
                key: 'counselor-3',
                firstName: process.env.SEEDER_COUNSELOR_3_FIRST_NAME || 'Cleir',
                lastName: process.env.SEEDER_COUNSELOR_3_LAST_NAME || 'Tayaba',
                email: process.env.SEEDER_COUNSELOR_3_EMAIL || 'cleir.tayaba@zppsu.edu.ph',
                password: process.env.SEEDER_COUNSELOR_3_PASSWORD || 'CounselorPassword123!',
            },
        ],
        faculty: {
            firstName: process.env.SEEDER_FACULTY_FIRST_NAME || 'Ricardo',
            lastName: process.env.SEEDER_FACULTY_LAST_NAME || 'Dalisay',
            email: process.env.SEEDER_FACULTY_EMAIL || 'faculty@zppsu.edu.ph',
            password: process.env.SEEDER_FACULTY_PASSWORD || 'FacultyPassword123!',
            employeeId: process.env.SEEDER_FACULTY_EMPLOYEE_ID || 'FAC-2023-001',
            department: process.env.SEEDER_FACULTY_DEPARTMENT || 'Engineering',
            designation: process.env.SEEDER_FACULTY_DESIGNATION || 'Department Head',
        },
        student: {
            firstName: process.env.SEEDER_STUDENT_FIRST_NAME || 'Juan',
            lastName: process.env.SEEDER_STUDENT_LAST_NAME || 'Dela Cruz',
            email: process.env.SEEDER_STUDENT_EMAIL || 'student@zppsu.edu.ph',
            password: process.env.SEEDER_STUDENT_PASSWORD || 'StudentPassword123!',
            studentId: process.env.SEEDER_STUDENT_ID || '2023-0001',
            course: process.env.SEEDER_STUDENT_COURSE || 'BS Information Technology',
            yearLevel: parseInt(process.env.SEEDER_STUDENT_YEAR_LEVEL || '3', 10),
            section: process.env.SEEDER_STUDENT_SECTION || 'A',
        }
    }
};
