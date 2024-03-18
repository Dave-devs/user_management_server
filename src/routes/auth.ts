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
          throw new CustomError('All required fields must be provided.');
        }

        const existingUser = await User.findOne({ where: { email: email } });
        if(existingUser) {
          throw new CustomError('User with the same email already exists.');
        }

        const hashedPassword = await bcryptjs.hash(password, 12);

        const user = await User.create({
            username, 
            email, 
            password: hashedPassword, 
        });
        // Save User to database
        await user.save();
        // Return user
        res.status(201).json({user: user});
    
    } catch (error) {
        if (error instanceof ValidationError) {
          res.status(400).json({ error: error.errors[0].message });
        } else {
          console.error(error);
          res.status(500).json({ error: 'Error creating user' });
        }
    }
})

authRouter.post('/api/signin', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if(!email || !password) {
          throw new CustomError('Please provide both email and password.');
        }

        const user = await User.findOne({ where: { email: email } });
        if(!user) {
          throw new CustomError('User with this email does not exist.');
        }

        const isMatched = await bcryptjs.compare(password, user.password);
        if(!isMatched) {
          throw new CustomError('Incorrect password.');
        }

        const token = jwt.sign({    id: user.id }, 'passwordKey')

        res.status(202).json({token, ...user}); 
    } catch (error) {
         if (error instanceof ValidationError) {
          res.status(400).json({ error: error.errors[0].message });
        } else {
          console.error(error);
          res.status(500).json({ error: 'Error signing in user' });
        }
    }
})

authRouter.post('/tokenisvalid', async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(204).json(false);
    }
    const decoded = jwt.verify(token, 'passwordKey');
    if (!decoded || typeof decoded !== 'object') {
      return res.status(204).json(false);
    }
    const user = await User.findByPk(decoded.user.id);
    if (!user) {
      return res.status(204).json(false);
    }
    res.json(true);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
})

authRouter.put('/api/update-details/:id', auth, async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    if (!hashedPassword) {
      return res.status(500).json({ error: 'Error hashing password' });
    }

    await User.update({ username, password: hashedPassword }, { where: { id: req.params.id } });
    res.status(200).json({ message: 'User details updated successfully' });
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

    // Return only necessary user details (excluding sensitive info)
    res.status(200).json({ username: user.username });
    // Include token in response if needed based on your API design
    // res.status(200).json({ ...user, token: req.body.token });
  } catch (error) {
    if (error instanceof ValidationError) {
      res.status(400).json({ error: error.errors[0].message });
    } else {
      res.status(500).json({ error: 'Error retrieving user details' });
    }
  }
});

authRouter.delete('/api/delete-user/:id', auth, async (req: Request, res: Response) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    await User.destroy({ where: { id: req.params.id } });
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting user' });
  }
});

export default authRouter;