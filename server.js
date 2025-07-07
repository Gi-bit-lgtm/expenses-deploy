const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const app = express();
dotenv.config();

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Register
app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hashed });
    res.redirect('/login.html');
});

// Login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
        res.cookie('token', token).redirect('/index.html');
    } else {
        res.send('Invalid credentials');
    }
});


const Expense = require('./models/Expense');

// Middleware to simulate authentication for demo purposes
app.use((req, res, next) => {
    req.user = { userId: "666666666666666666666666" }; // Replace with real auth in production
    next();
});

// Create new expense
app.post('/api/expenses', async (req, res) => {
    const { category, amount, status } = req.body;
    const expense = await Expense.create({
        userId: req.user.userId,
        category,
        amount,
        status
    });
    res.json(expense);
});

// Get all expenses
app.get('/api/expenses', async (req, res) => {
    const expenses = await Expense.find({ userId: req.user.userId });
    res.json(expenses);
});


app.listen(3000, () => console.log('Server running on http://localhost:3000'));
