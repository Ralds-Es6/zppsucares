import { config } from '../config';
import { AdminUser, MainUser } from '../models/DatabaseRouter';
import { UserRole } from '../models/UserModel';
import { Faculty } from '../models/FacultyModel';
import { Student } from '../models/StudentModel';
import { connectDB } from '../config/db';

interface AdminSeederConfig {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

const syncAdminAccount = async (
    seederKey: string,
    adminConfig: AdminSeederConfig,
    allowRoleFallback = false
) => {
    const targetEmail = adminConfig.email.toLowerCase().trim();

    // 1. Find existing admin: by seederKey, current email, or (for primary admin) legacy email/role
    let admin = await AdminUser.findOne({ seederKey }).select('+password');
    if (!admin) {
        admin = await AdminUser.findOne({ email: targetEmail }).select('+password');
    }
    if (!admin && allowRoleFallback) {
        admin = await AdminUser.findOne({ email: 'admin@zppsu.edu.ph' }).select('+password');
    }
    if (!admin && allowRoleFallback) {
        admin = await AdminUser.findOne({ role: UserRole.ADMIN }).select('+password');
    }

    if (admin) {
        let changed = false;

        if (admin.seederKey !== seederKey) {
            admin.seederKey = seederKey;
            changed = true;
        }
        if (!admin.isSeeder) {
            admin.isSeeder = true;
            changed = true;
        }
        if (admin.role !== UserRole.ADMIN) {
            admin.role = UserRole.ADMIN;
            changed = true;
        }
        if (admin.firstName !== adminConfig.firstName) {
            admin.firstName = adminConfig.firstName;
            changed = true;
        }
        if (admin.lastName !== adminConfig.lastName) {
            admin.lastName = adminConfig.lastName;
            changed = true;
        }
        if (admin.email !== targetEmail) {
            const conflict = await AdminUser.findOne({ email: targetEmail, _id: { $ne: admin._id } });
            if (conflict) {
                console.warn(`[Seeder Admin:${seederKey}] Warning: Target email ${targetEmail} is already taken by another admin user.`);
            } else {
                console.log(`[Seeder Admin:${seederKey}] Updating admin email: ${admin.email} -> ${targetEmail}`);
                admin.email = targetEmail;
                changed = true;
            }
        }

        const isPasswordMatch = await admin.matchPassword(adminConfig.password);
        if (!isPasswordMatch) {
            console.log(`[Seeder Admin:${seederKey}] Updating admin password to match .env value.`);
            admin.password = adminConfig.password;
            changed = true;
        }

        if (!admin.isActive) {
            admin.isActive = true;
            changed = true;
        }

        if (changed) {
            await admin.save();
            console.log(`[Seeder Admin:${seederKey}] Super Admin account updated successfully (${admin.email}).`);
        } else {
            console.log(`[Seeder Admin:${seederKey}] Super Admin account is up-to-date (${admin.email}).`);
        }
        return admin;
    } else {
        console.log(`[Seeder Admin:${seederKey}] Creating Super Admin Account from .env...`);
        const newAdmin = await AdminUser.create({
            firstName: adminConfig.firstName,
            lastName: adminConfig.lastName,
            email: targetEmail,
            password: adminConfig.password,
            role: UserRole.ADMIN,
            isActive: true,
            isSeeder: true,
            seederKey,
        });
        console.log(`[Seeder Admin:${seederKey}] Super Admin account created successfully (${newAdmin.email}).`);
        return newAdmin;
    }
};

export const syncAdminSeeder = async () => {
    return syncAdminAccount('admin', config.seeder.admin, true);
};

export const syncCounselorAdminSeeders = async () => {
    const results = [];
    for (const counselor of config.seeder.counselors) {
        const synced = await syncAdminAccount(counselor.key, counselor, false);
        results.push(synced);
    }
    return results;
};

export const syncFacultySeeder = async () => {
    const facultyConfig = config.seeder.faculty;
    const targetEmail = facultyConfig.email.toLowerCase().trim();

    // 1. Find existing faculty: by seederKey, target email, employeeId, or legacy email
    let facultyUser = await MainUser.findOne({ seederKey: 'faculty' }).select('+password');
    if (!facultyUser) {
        facultyUser = await MainUser.findOne({ email: targetEmail }).select('+password');
    }
    if (!facultyUser) {
        const existingProfile = await Faculty.findOne({ employeeId: facultyConfig.employeeId });
        if (existingProfile) {
            facultyUser = await MainUser.findById(existingProfile.user).select('+password');
        }
    }
    if (!facultyUser) {
        facultyUser = await MainUser.findOne({ email: 'faculty@zppsu.edu.ph' }).select('+password');
    }

    if (facultyUser) {
        let changed = false;

        if (facultyUser.seederKey !== 'faculty') {
            facultyUser.seederKey = 'faculty';
            changed = true;
        }
        if (!facultyUser.isSeeder) {
            facultyUser.isSeeder = true;
            changed = true;
        }
        if (facultyUser.firstName !== facultyConfig.firstName) {
            facultyUser.firstName = facultyConfig.firstName;
            changed = true;
        }
        if (facultyUser.lastName !== facultyConfig.lastName) {
            facultyUser.lastName = facultyConfig.lastName;
            changed = true;
        }
        if (facultyUser.email !== targetEmail) {
            const conflict = await MainUser.findOne({ email: targetEmail, _id: { $ne: facultyUser._id } });
            if (conflict) {
                console.warn(`[Seeder Faculty] Warning: Target email ${targetEmail} is already taken by another user.`);
            } else {
                console.log(`[Seeder Faculty] Updating faculty email: ${facultyUser.email} -> ${targetEmail}`);
                facultyUser.email = targetEmail;
                changed = true;
            }
        }

        const isPasswordMatch = await facultyUser.matchPassword(facultyConfig.password);
        if (!isPasswordMatch) {
            console.log(`[Seeder Faculty] Updating faculty password to match .env value.`);
            facultyUser.password = facultyConfig.password;
            changed = true;
        }

        if (!facultyUser.isActive) {
            facultyUser.isActive = true;
            changed = true;
        }
        if (facultyUser.role !== UserRole.FACULTY) {
            facultyUser.role = UserRole.FACULTY;
            changed = true;
        }

        if (changed) {
            await facultyUser.save();
        }
    } else {
        console.log(`[Seeder Faculty] Creating Faculty Account from .env...`);
        facultyUser = await MainUser.create({
            firstName: facultyConfig.firstName,
            lastName: facultyConfig.lastName,
            email: targetEmail,
            password: facultyConfig.password,
            role: UserRole.FACULTY,
            isActive: true,
            isSeeder: true,
            seederKey: 'faculty',
        });
    }

    // 2. Sync Faculty Profile
    let facultyProfile = await Faculty.findOne({ user: facultyUser._id });
    if (!facultyProfile) {
        facultyProfile = await Faculty.findOne({ employeeId: facultyConfig.employeeId });
    }

    if (facultyProfile) {
        facultyProfile.user = facultyUser._id as any;
        facultyProfile.employeeId = facultyConfig.employeeId;
        facultyProfile.department = facultyConfig.department;
        facultyProfile.designation = facultyConfig.designation;
        await facultyProfile.save();
    } else {
        facultyProfile = await Faculty.create({
            user: facultyUser._id,
            employeeId: facultyConfig.employeeId,
            department: facultyConfig.department,
            designation: facultyConfig.designation,
        });
    }

    if (String(facultyUser.facultyProfile) !== String(facultyProfile._id)) {
        facultyUser.facultyProfile = facultyProfile._id as any;
        await facultyUser.save();
    }

    console.log(`[Seeder Faculty] Faculty account synchronized successfully (${facultyUser.email}, ${facultyProfile.employeeId}).`);
    return { user: facultyUser, profile: facultyProfile };
};

export const syncStudentSeeder = async () => {
    const studentConfig = config.seeder.student;
    const targetEmail = studentConfig.email.toLowerCase().trim();

    // 1. Find existing student: by seederKey, target email, studentId, or legacy email
    let studentUser = await MainUser.findOne({ seederKey: 'student' }).select('+password');
    if (!studentUser) {
        studentUser = await MainUser.findOne({ email: targetEmail }).select('+password');
    }
    if (!studentUser) {
        const existingProfile = await Student.findOne({ studentId: studentConfig.studentId });
        if (existingProfile) {
            studentUser = await MainUser.findById(existingProfile.user).select('+password');
        }
    }
    if (!studentUser) {
        studentUser = await MainUser.findOne({ email: 'student@zppsu.edu.ph' }).select('+password');
    }

    if (studentUser) {
        let changed = false;

        if (studentUser.seederKey !== 'student') {
            studentUser.seederKey = 'student';
            changed = true;
        }
        if (!studentUser.isSeeder) {
            studentUser.isSeeder = true;
            changed = true;
        }
        if (studentUser.firstName !== studentConfig.firstName) {
            studentUser.firstName = studentConfig.firstName;
            changed = true;
        }
        if (studentUser.lastName !== studentConfig.lastName) {
            studentUser.lastName = studentConfig.lastName;
            changed = true;
        }
        if (studentUser.email !== targetEmail) {
            const conflict = await MainUser.findOne({ email: targetEmail, _id: { $ne: studentUser._id } });
            if (conflict) {
                console.warn(`[Seeder Student] Warning: Target email ${targetEmail} is already taken by another user.`);
            } else {
                console.log(`[Seeder Student] Updating student email: ${studentUser.email} -> ${targetEmail}`);
                studentUser.email = targetEmail;
                changed = true;
            }
        }

        const isPasswordMatch = await studentUser.matchPassword(studentConfig.password);
        if (!isPasswordMatch) {
            console.log(`[Seeder Student] Updating student password to match .env value.`);
            studentUser.password = studentConfig.password;
            changed = true;
        }

        if (!studentUser.isActive) {
            studentUser.isActive = true;
            changed = true;
        }
        if (studentUser.role !== UserRole.STUDENT) {
            studentUser.role = UserRole.STUDENT;
            changed = true;
        }

        if (changed) {
            await studentUser.save();
        }
    } else {
        console.log(`[Seeder Student] Creating Student User Account from .env...`);
        studentUser = await MainUser.create({
            firstName: studentConfig.firstName,
            lastName: studentConfig.lastName,
            email: targetEmail,
            password: studentConfig.password,
            role: UserRole.STUDENT,
            isActive: true,
            isSeeder: true,
            seederKey: 'student',
        });
    }

    // 2. Sync Student Profile
    let studentProfile = await Student.findOne({ user: studentUser._id });
    if (!studentProfile) {
        studentProfile = await Student.findOne({ studentId: studentConfig.studentId });
    }

    if (studentProfile) {
        studentProfile.user = studentUser._id as any;
        studentProfile.studentId = studentConfig.studentId;
        studentProfile.course = studentConfig.course;
        studentProfile.yearLevel = studentConfig.yearLevel;
        studentProfile.section = studentConfig.section;
        await studentProfile.save();
    } else {
        studentProfile = await Student.create({
            user: studentUser._id,
            studentId: studentConfig.studentId,
            course: studentConfig.course,
            yearLevel: studentConfig.yearLevel,
            section: studentConfig.section,
        });
    }

    if (String(studentUser.studentProfile) !== String(studentProfile._id)) {
        studentUser.studentProfile = studentProfile._id as any;
        await studentUser.save();
    }

    console.log(`[Seeder Student] Student account synchronized successfully (${studentUser.email}, ${studentProfile.studentId}).`);
    return { user: studentUser, profile: studentProfile };
};

export const syncAllSeeders = async () => {
    console.log('--- Synchronizing Seeder Accounts with .env ---');
    await syncAdminSeeder();
    await syncCounselorAdminSeeders();
    await syncFacultySeeder();
    await syncStudentSeeder();
    console.log('--- Seeder Accounts Synchronization Complete ---');
};

// If executed directly from command line (e.g. npm run seed)
if (process.argv[1] && (process.argv[1].endsWith('syncSeeders.ts') || process.argv[1].endsWith('syncSeeders.js'))) {
    (async () => {
        try {
            await connectDB();
            await syncAllSeeders();
            process.exit(0);
        } catch (error) {
            console.error('Error synchronizing seeders:', error);
            process.exit(1);
        }
    })();
}

