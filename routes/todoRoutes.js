const express = require('express');
const { getTodos, addTodo, updateTodo, deleteTodo } = require('../controllers/todoController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { addToDoLimiter } = require('../middlewares/rateLimitMiddleware');

const router = express.Router();

router.get('/', verifyToken, getTodos);
router.post('/add', verifyToken, addToDoLimiter, addTodo);
router.put('/update/:id', verifyToken, updateTodo);
router.delete('/delete/:id', verifyToken, deleteTodo);

module.exports = router;
