import { Request, Response, Router } from 'express';
import User from '../models/users';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import auth from '../middlewares/auth';
import { CustomError } from '../middlewares/error';
import { ValidationError } from 'sequelize';

const authRouter = Router();

authRouter.post('/api/signup', async (req: Request, res: Response) => {
    try {
        const { username, email, password } = req.body;
        
        if(!username || !email || !password) {
            throw new CustomError('Please enter all fields!');
        }

        const existingUser = await User.findOne({ where: { email: email } });
        if(existingUser) {
            throw new CustomError('Whoops! User with same email already exist!');
        }

        const hasedPassword = await bcryptjs.hash(password, 12);

        const user = await User.create({
            username, 
            email, 
            password: hasedPassword, 
        });
        // Save User to database
        await user.save();
        // Return user
        res.status(201).json({user: user});
    
    } catch (error) {
        if (error instanceof ValidationError) {
            res.status(400).json({ error: error.errors[0].message });
        } else {
            res.status(500).json({ error: 'There seem to be an error while creating user' });
        }
    }
})

authRouter.post('/api/signin', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if(!email || !password) {
            throw new CustomError('Whoops!! there seems to be error with your email or password');
        }

        const user = await User.findOne({ where: { email: email } });
        if(!user) {
            throw new CustomError('Whoops!! User with same emeil does not exist.');
        }

        const isMatched = await bcryptjs.compare(password, user.password);
        if(!isMatched) {
            throw new CustomError('Password does not match!')
        }

        const token = jwt.sign({    id: user.id }, 'passwordKey')

        res.status(202).json({token, ...user}); 
    } catch (error) {
         if (error instanceof ValidationError) {
            res.status(400).json({ error: error.errors[0].message });
        } else {
            res.status(500).json({ error: 'Error signing in user' });
        }
    }
})

authRouter.post('/tokenisvalid', async (req: Request, res: Response) => {
    try {
        //Check if the token is present. If it is not, we return False.
        // const token = req.header('x-auth-token');
        const token = req.headers.authorization || 'x-auth-token'
        //If token is empty return false
        if(!token) return res.status(204).json(false);

        //Check if the token is verified. If it is not, we return False.
        const decoded = jwt.verify(token, 'passwordKey');
        //If token is not verified return false
        if(!decoded) return res.status(204).json(false);
        

        // Check if decoded is of type UserToken (meaning verification succeeded)
        if (typeof decoded === 'string') { // Token verification failed
            return res.status(204).json(false);
        }

    const user = await User.findByPk(decoded.id);
        
        if(!user) return res.status(204).json(false);

        res.json(true);
    } catch (error) {
         if (error instanceof ValidationError) {
            res.status(400).json({ error: error.errors[0].message });
        } else {
            res.status(500).json({error: 'Error occured!'});
        }
    }
});

authRouter.put('/:id', auth, async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    // Check if user exists before updating
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    await User.update({ username, password: hashedPassword }, { where: { id: req.params.id } });
    res.sendStatus(204);
  } catch (error) {
    if (error instanceof ValidationError) {
      res.status(400).json({ error: error.errors[0].message });
    } else {
      console.error(error);
      res.status(500).json({ error: 'Error updating user details.' });
    }
  }
});

authRouter.get('/', auth, async (req: Request, res: Response) => {
  try {
    // Use req.params.id for ID from route parameter
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Include token in response if needed based on your API design
    res.status(200).json({ ...user, token: req.body.token }); // Consider removing token if sent in headers
  } catch (error) {
    if (error instanceof ValidationError) {
      res.status(400).json({ error: error.errors[0].message });
    } else {
      res.status(500).json({ error: 'Error retrieving user details' });
    }
  }
});

authRouter.delete('/:id', auth, async (req: Request, res: Response) => {
  try {
    // Use req.params.id for ID to be deleted
    await User.destroy({ where: { id: req.params.id } });
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: 'Error deleting user' });
  }
});


// TODO: Error Autorizing user in getting user and deleting user

export default authRouter;