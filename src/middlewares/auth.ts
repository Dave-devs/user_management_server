import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import User from '../models/users'

interface UserToken extends jwt.JwtPayload {
  user: User;
}

// async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         //Check if the token is present. If it is not, we return a 401 error message.
//         const token = req.header('x-auth-token');
//         if(!token) {
//             return res.status(401).json({msg: 'No authentication token. Access denied!'});
//         }

//         //Check if the token is verified. If it is not, we return a 401 error message.
//         const decoded: UserToken = jwt.verify(token, 'passwordKey') as UserToken;
//         if(!decoded) {
//             return res.status(401).json({msg: 'Token verification failed. Access denied!'});
//         }

//         const { id } = decoded.user;
//         res.locals.token = {
//             id
//         }

//         // req.user = decoded.id;
//         // req.token = token;
//         next();
//     } catch (error) {
//         res.status(500).json({error: 'Invalid token!'});
//     }
// }

// async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         //Check if the token is present. If it is not, we return a 401 error message.
//         const authHeader = req.headers.authorization || 'x-auth-token'
//         const token = authHeader.split(' ')[1];
//         if(!token) {
//             return res.status(401).json({msg: 'No authentication token. Access denied!'});
//         }

//         //Check if the token is verified. If it is not, we return a 401 error message.
//         const isVerified: UserToken = jwt.verify(token, 'passwordKey') as UserToken;
//         if(!isVerified) {
//             return res.status(401).json({msg: 'Token verification failed. Access denied!'});
//         }
//         const { id } = isVerified.user;
//         res.locals.token = {
//             id
//         }
        
//         next();
//     } catch (error) {
//         res.status(500).json({error: 'Invalid token!'});
//     }
// }

// const auth = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const authHeader = req.headers.authorization || 'x-auth-token';
//     const token = authHeader.split(' ')[1];
//     if (!authHeader || token) {
//       return res.status(401).json({ msg: 'No authentication token. Access denied!' });
//     }

//     const decoded: UserToken = jwt.verify(token, 'passwordKey') as UserToken; // Replace with your secret key
//     if (!decoded) {
//       return res.status(401).json({ msg: 'Token verification failed. Access denied!' });
//     }

//     const { id } = decoded.user;
//     res.locals.userId = id;

//     next();
//   } catch (error) {
//     if (error instanceof jwt.JsonWebTokenError) {
//       return res.status(401).json({ msg: 'Invalid token!' });
//     } else {
//       console.error(error);
//       return res.status(500).json({ error: 'Internal server error' });
//     }
//   }
// };


// async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const authHeader = req.get('Authorization');
//         if(authHeader) {
//             const bearer = authHeader.split(' ')[0].toLocaleLowerCase();
//             const token = authHeader.split(' ')[1];
//             if(token && bearer === 'bearer') {
//                const decode = jwt.verify(token, 'passwordKey') as unknown as string;
//                console.log(decode)
//                if(decode) {
//                 next();
//                } else {
//                 return res.status(401).json({msg: 'No authentication token. Access denied!'});
//                }
//             } else {
//                 return res.status(401).json({msg: 'No authentication token. Access denied!'});
//             }
//         } else {
//             return res.status(401).json({msg: 'No authentication token. Access denied!'});
//         }
//     } catch (error) {
//         res.status(500).json({error: 'Invalid token!'});
//     }
// }

const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ msg: 'No authentication token. Access denied!' });
        }
        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ msg: 'Invalid token format. Access denied!' });
        }

        const decoded: UserToken = jwt.verify(token, 'passwordKey') as UserToken;
        if (!decoded) {
            return res.status(401).json({ msg: 'Token verification failed. Access denied!' });
        }

        res.locals.id = decoded.user.id;
        next()
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export default auth;