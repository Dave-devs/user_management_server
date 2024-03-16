// Imports From Packages
import express, { Application } from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import RateLimit from 'express-rate-limit';
import errorMiddleware from './middlewares/error-middleware';
import config from './config';
import User from './models/users';
import Todo from './models/todos';

import authRouter from './routes/auth';
import todoRouter from './routes/todos';

// Package Initializations
const app: Application  = express();
// Middelwares
app.use(express.json());
app.use(errorMiddleware);
app.use(morgan('common'));
app.use(helmet());
app.use(
    RateLimit({
        windowMs: 60 * 60 * 1000,
        max: 100,
        standardHeaders: true,
        legacyHeaders: false,
        message: 'Too many requests from this IP, please try again in an hour!',
    })
);
app.use(authRouter);
app.use(todoRouter);

const PORT = config.port || 3000;

const sync = async () => {
    try {
        await User.sync({ alter: true });
        await Todo.sync({ alter: true });
        console.log('Database connected successfully');
    } catch (error) {
        console.log(error);
    }
}
sync();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

export default app;
