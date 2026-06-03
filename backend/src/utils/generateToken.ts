import jwt from 'jsonwebtoken';
import { config } from '../config';

const generateToken = (id: string, role: string) => {
    return jwt.sign({ id, role }, config.jwtSecret, {
        expiresIn: '30d',
    });
};

export default generateToken;
