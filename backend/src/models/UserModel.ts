import mongoose, { Document, Model, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

export enum UserRole {
    ADMIN = 'admin',
    SUBADMIN = 'subadmin',
    FACULTY = 'faculty',
    STUDENT = 'student'
}

export interface IUser extends Document {
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    role: UserRole;
    isActive: boolean;
    // Role specific references (polymorphic relation strategy)
    studentProfile?: mongoose.Types.ObjectId;
    facultyProfile?: mongoose.Types.ObjectId;
    isSeeder?: boolean;
    seederKey?: string;

    matchPassword(enteredPassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
    {
        firstName: {
            type: String,
            required: [true, 'First name is required'],
            trim: true,
        },
        lastName: {
            type: String,
            required: [true, 'Last name is required'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: 6,
            select: false, // Don't return password by default in queries
        },
        role: {
            type: String,
            enum: Object.values(UserRole),
            default: UserRole.STUDENT,
            required: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        isSeeder: {
            type: Boolean,
            default: false,
            index: true,
        },
        seederKey: {
            type: String,
            sparse: true,
            index: true,
        },
        // References to specialized profile documents
        studentProfile: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student',
        },
        facultyProfile: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Faculty',
        },
    },
    {
        timestamps: true,
    }
);

// Encrypt password using bcrypt before saving
UserSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password as string, salt);
});

// Method to verify password
UserSchema.methods.matchPassword = async function (enteredPassword: string) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Create a compound index to ensure role-specific profile integrity 
// (e.g. a user can't be both linked to a student AND a faculty profile easily if we wanted to enforce it here)

// We export the Schema, NOT the compiled model, so that we can compile it
// against specific database connections (Admin vs Main) dynamically.
export { UserSchema };
