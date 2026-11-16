import { mainDb, adminDb } from '../config/db';
import { UserSchema, IUser } from '../models/UserModel';
import { appointmentSchema } from '../models/AppointmentModel';
import { Model } from 'mongoose';
import './StudentModel';
import './FacultyModel';
import './DepartmentModel';
import './CourseModel';

// User Models
export const MainUser: Model<IUser> = mainDb.model<IUser>('User', UserSchema);
export const AdminUser: Model<IUser> = adminDb.model<IUser>('User', UserSchema);

// Appointment Model
export const Appointment: Model<any> = mainDb.model('Appointment', appointmentSchema);

