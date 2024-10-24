const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
    const { username, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: 'User created' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

exports.signin = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ error: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '5m' });
        const refreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_SECRET, { expiresIn: '1d' });

        res.cookie('token', token, { httpOnly: true });
        res.cookie('refreshToken', refreshToken, { httpOnly: true });
        res.status(200).json({ message: 'Login successful',Token:token,RefreshToken:refreshToken });
    } catch (error) {
        console.log("error",error)
        res.status(500).json({ error: 'Server error' });
    }
};

exports.refreshToken = (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) return res.status(403).json({ message: 'Access denied' });
    
        jwt.verify(refreshToken, process.env.REFRESH_SECRET, (err, user) => {
            if (err) return res.status(403).json({ message: 'Invalid token' });
    
            const newToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '5m' });
            res.cookie('token', newToken, { httpOnly: true });
            res.status(200).json({ message: 'Token refreshed',newToken:newToken });
        });
    } catch (error) {
        console.log("error",error)
        res.status(500).json({ error: 'Server error' });
    }
   
};
