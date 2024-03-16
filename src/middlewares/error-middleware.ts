import { Request, Response, NextFunction, } from 'express';
import Error from '../interface/error-interface';

const errorMiddleware = (error: Error, req: Request, res: Response, next: NextFunction) => {
    const status = error.status || 500;
    const message = error.message || 'Internal server error occurred! / Whoops!! something went wrong';
    res.status(status).json({ status, message })
    
    next();
}

export default errorMiddleware;