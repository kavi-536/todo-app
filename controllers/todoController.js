const ToDo = require('../models/ToDo');

exports.getTodos = async (req, res) => {
    try {
        const todos = await ToDo.find({ user: req.user.id });
        res.json(todos);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

exports.addTodo = async (req, res) => {
    try {
        const { task } = req.body;
        const newToDo = new ToDo({
            task,
            user: req.user.id
        });
        await newToDo.save();
        res.status(201).json({ message: 'To-Do added' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

exports.updateTodo = async (req, res) => {
    try {
        const { task } = req.body;
        const todo = await ToDo.findById(req.params.id);
        if (!todo) {
            return res.status(404).json({ message: 'To-Do not found' });
        }
        
        if (todo.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to update this To-Do' });
        }
        todo.task = task;
        await todo.save();
        res.status(200).json({ message: 'To-Do updated' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

exports.deleteTodo = async (req, res) => {
    try {
        const todo = await ToDo.findById(req.params.id);
        if (!todo) {
            return res.status(404).json({ message: 'To-Do not found' });
        }
        
        if (todo.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to delete this To-Do' });
        }
        await ToDo.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'To-Do deleted' });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Server error' });
    }
};
