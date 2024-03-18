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
            throw new CustomError('All required fields must be provided.');
        }
        const todo = await Todo.create({
            title,
            description,
        })

         await todo.save();

         res.status(201).json({ todo: todo, message: 'Todo created successfully!' });
    } catch (error) {
        if (error instanceof ValidationError) {
            res.status(400).json({ error: error.errors[0].message });
        } else {
            console.error(error);
            res.status(500).json({ error: 'Error creating todo' });
        }
    }
});

// Get All Todos IT NEED TO HAVE AUTH IN THE HEADERS
todoRouter.get('/api/todos', auth, async (req: Request, res: Response) => {
    try {
        const todos = await Todo.findAll();

        if(todos.length === 0) {
            return res.status(400).json({ msg: 'Whoops! The todo list is empty.' });
        }

        return res.status(200).json({ todos: todos, message: 'Todos fetched successfully!' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error occurred!' });
    }
})

// Get A Single Todo By ID
todoRouter.get('/api/todos/:id', auth, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const todo = await Todo.findByPk(id);
        if(!todo) {
            return res.status(404).json({ msg: 'Todo not found!' });
        }

        return res.status(200).json({ todo: todo, message: 'Todo fetched successfully!' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error occurred!' });
    }
})

// Update the status of Todo
todoRouter.put('/api/todos/:id', auth, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['in-progress', 'done'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const updatedTodo = await Todo.findByPk(id);
        if (!updatedTodo) {
            return res.status(404).json({ message: 'Todo not found!' });
        }
        updatedTodo.status = status;

        await updatedTodo.save();

        return res.status(200).json({ todo: updatedTodo, message: 'Todo status updated successfully!' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error occurred!' });
    }
})

todoRouter.delete('/api/todos/:id', auth, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const todo = await Todo.findByPk(id);
        if(!todo) {
            return res.status(404).json({ msg: 'Todo not found!' });
        }

        await todo.destroy();
        return res.status(200).json({ msg: 'Todo deleted successfully!' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error occurred!' });
    }
})

export default todoRouter;