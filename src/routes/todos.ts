import { Request, Response, Router } from 'express';
import Todo from '../models/todos';
import auth from '../middlewares/auth';
import { CustomError } from '../middlewares/error';
import { ValidationError } from 'sequelize';

const todoRouter = Router();

// Create Todo
todoRouter.post('/api/todo', auth, async (req: Request, res: Response) => {
    try {
        const { title, description } = req.body;

        if(!title || !description ) {
            throw new CustomError('Please enter all fields!')
        }
         const todo = await Todo.create({
             title,
             description,
         })

         await todo.save();

         res.json({todo: todo})
         return res.status(201).json({ message: 'Todo created successfully!' })
    } catch (error) {
        if (error instanceof ValidationError) {
            res.status(400).json({ error: error.errors[0].message });
        } else {
            res.status(500).json({ error: 'There seem to be an error while creating todo' });
        }
    }
});

// Get All Todos IT NEED TO HAVE AUTH IN THE HEADERS
todoRouter.get('/api/todos', auth, async (req: Request, res: Response) => {
    try {
        const todos = await Todo.findAll();

        if(todos.length === 0) {
            return res.status(400).json({ msg: 'Whoops!! todo list is empty.' })
        }

        res.json({todos: todos})
        return res.status(200).json({ message: 'Todos fetched successfully!' })
    } catch (error) {
        res.status(500).json({ error: 'Internal server occurred!' });
    }
})

// Get A Single Todo By ID
todoRouter.get('/api/todos/:id', auth, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const todo = await Todo.findByPk(id);
        if(!todo) {
            return res.status(404).json({ msg: 'Todo not found!' })
        }

        res.json({todo: todo})
        return res.status(200).json({ message: 'Todo fetched successfully!' })
    } catch (error) {
        res.status(500).json({ error: 'Internal server occurred!' });
    }
})

// Update the status of Todo
todoRouter.put('/api/todos/:id', auth, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if(!['in-progress', 'done'].includes(status)) {
            return res.status(404).json({ mesaage: 'Invalid status'})
        }

        const updatedTodo = await Todo.findByPk(id);
        if(!updatedTodo) {
            return res.status(404).json({ message: 'Todo not found!' });
        }
        updatedTodo.status = status;

        await updatedTodo.save();

        res.json({todo: updatedTodo});
        return res.status(200).json({ message: 'Todo status updated successfully!' })
    } catch (error) {
        res.status(500).json({ error: 'Internal server occurred!' });
    }
})

todoRouter.delete('/api/todos/:id', auth, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const todo = await Todo.findByPk(id);
        if(!todo) {
            return res.status(404).json({ msg: 'Todo not found!' })
        }

        await todo.destroy();
        res.status(200).json({ msg: 'Todo deleted successfully!' })
    } catch (error) {
        res.status(500).json({ error: 'Internal server occurred!' });
    }
})

export default todoRouter;