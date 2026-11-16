import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { MainUser, AdminUser } from '../models/DatabaseRouter';
import { config } from '../config';

interface DecodedToken {
    id: string;
    role: string;
}

declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            if (!token) {
                return res.status(401).json({ message: 'Not authorized, token missing' });
            }
            const decoded = jwt.verify(token, config.jwtSecret) as any as DecodedToken;

            let user;
            if (decoded.role === 'admin' || decoded.role === 'subadmin') {
                user = await AdminUser.findById(decoded.id).select('-password');
            } else {
                user = await MainUser.findById(decoded.id).select('-password');
            }

            if (!user) {
                return res.status(401).json({ message: 'Not authorized, user not found' });
            }

            req.user = user;
            next();
        } catch (error) {
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

export const adminOnly = (req: Request, res: Response, next: NextFunction) => {
    if (req.user && (req.user.role === 'admin' || req.user.role === 'subadmin')) {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as an administrator' });
    }
};

export const superAdminOnly = (req: Request, res: Response, next: NextFunction) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Permission denied: Super Administrator authority required' });
    }
};

export const staffOnly = (req: Request, res: Response, next: NextFunction) => {
    if (req.user && (req.user.role === 'admin' || req.user.role === 'subadmin' || req.user.role === 'faculty')) {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized: Staff access only' });
    }
};
