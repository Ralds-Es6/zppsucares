export interface StoredUser {
    _id?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    role?: 'student' | 'faculty' | 'admin' | 'subadmin' | string;
    token?: string;
    studentProfile?: Record<string, unknown>;
    facultyProfile?: Record<string, unknown>;
    [key: string]: unknown;
}

export const STORAGE_KEYS = {
    STUDENT: 'student_userInfo',
    FACULTY: 'faculty_userInfo',
    ADMIN: 'admin_userInfo',
} as const;

export const authStorage = {
    // --- Student Storage ---
    getStudent: (): StoredUser | null => {
        try {
            const raw = localStorage.getItem(STORAGE_KEYS.STUDENT);
            if (raw) return JSON.parse(raw);

            // Backward compatibility fallback to generic 'userInfo' if role is student
            const legacy = localStorage.getItem('userInfo');
            if (legacy) {
                const parsed = JSON.parse(legacy);
                if (parsed && parsed.role === 'student') return parsed;
            }
        } catch (e) {
            console.error('Error reading student auth storage', e);
        }
        return null;
    },
    setStudent: (data: unknown) => {
        localStorage.setItem(STORAGE_KEYS.STUDENT, JSON.stringify(data));
    },
    removeStudent: () => {
        localStorage.removeItem(STORAGE_KEYS.STUDENT);
    },

    // --- Faculty Storage ---
    getFaculty: (): StoredUser | null => {
        try {
            const raw = localStorage.getItem(STORAGE_KEYS.FACULTY);
            if (raw) return JSON.parse(raw);

            // Backward compatibility fallback to generic 'userInfo' if role is faculty
            const legacy = localStorage.getItem('userInfo');
            if (legacy) {
                const parsed = JSON.parse(legacy);
                if (parsed && parsed.role === 'faculty') return parsed;
            }
        } catch (e) {
            console.error('Error reading faculty auth storage', e);
        }
        return null;
    },
    setFaculty: (data: unknown) => {
        localStorage.setItem(STORAGE_KEYS.FACULTY, JSON.stringify(data));
    },
    removeFaculty: () => {
        localStorage.removeItem(STORAGE_KEYS.FACULTY);
    },

    // --- Admin Storage ---
    getAdmin: (): StoredUser | null => {
        try {
            const raw = localStorage.getItem(STORAGE_KEYS.ADMIN);
            if (raw) return JSON.parse(raw);

            // Backward compatibility fallback to generic 'userInfo' if role is admin or subadmin
            const legacy = localStorage.getItem('userInfo');
            if (legacy) {
                const parsed = JSON.parse(legacy);
                if (parsed && (parsed.role === 'admin' || parsed.role === 'subadmin')) return parsed;
            }
        } catch (e) {
            console.error('Error reading admin auth storage', e);
        }
        return null;
    },
    setAdmin: (data: unknown) => {
        localStorage.setItem(STORAGE_KEYS.ADMIN, JSON.stringify(data));
    },
    removeAdmin: () => {
        localStorage.removeItem(STORAGE_KEYS.ADMIN);
    },

    // --- Role Helpers ---
    isSuperAdmin: (): boolean => {
        const admin = authStorage.getAdmin();
        return admin?.role === 'admin';
    },
    isSubAdmin: (): boolean => {
        const admin = authStorage.getAdmin();
        return admin?.role === 'subadmin';
    },
    isAdminOrSubAdmin: (): boolean => {
        const admin = authStorage.getAdmin();
        return admin?.role === 'admin' || admin?.role === 'subadmin';
    },
};

export default authStorage;
