const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    category: String,
    amount: Number,
    date: { type: Date, default: Date.now },
    status: String
});

module.exports = mongoose.model('Expense', ExpenseSchema);
