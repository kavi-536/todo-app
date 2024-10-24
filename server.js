const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const todoRoutes = require('./routes/todoRoutes');

dotenv.config();
const app = express();

connectDB();
app.use(express.json());
app.use(cookieParser());

const allowedOrigins = ['http://localhost:2395', 'http://localhost:8275', 'http://localhost:6290'];
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use('/api/auth', authRoutes);
app.use('/api/todo', todoRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
