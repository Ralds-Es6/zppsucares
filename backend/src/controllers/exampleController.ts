import { Request, Response, NextFunction } from 'express';
import { fetchExampleData } from '../services/exampleService';

export const getExample = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await fetchExampleData();
        res.status(200).json({ success: true, data });
    } catch (error) {
        next(error);
    }
};
