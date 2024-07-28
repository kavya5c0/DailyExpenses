const express = require('express');
const router = express.Router();
const Expense = require('../models/expense');

// Add a new expense
router.post('/', async (req, res) => {
    const expense = new Expense({
        userId: req.body.userId,
        amount: req.body.amount,
        description: req.body.description,
        date: req.body.date
    });
    try {
        const newExpense = await expense.save();
        res.status(201).json(newExpense);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all expenses
router.get('/all', async (req, res) => {
    try {
        const expenses = await Expense.find();
        res.json(expenses);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get expenses for a specific user
router.get('/user/:userId', async (req, res) => {
    try {
        const expenses = await Expense.find({ userId: req.params.userId });
        res.json(expenses);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update an expense
router.put('/:id', async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);
        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }
        expense.userId = req.body.userId || expense.userId;
        expense.amount = req.body.amount || expense.amount;
        expense.description = req.body.description || expense.description;
        expense.date = req.body.date || expense.date;

        const updatedExpense = await expense.save();
        res.json(updatedExpense);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete an expense
router.delete('/:id', async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);
        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }
        await expense.remove();
        res.json({ message: 'Expense deleted' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Generate and download balance sheet
const { Parser } = require('json2csv');
router.get('/download', async (req, res) => {
    try {
        const expenses = await Expense.find();
        const fields = ['userId', 'amount', 'description', 'date'];
        const opts = { fields };
        const parser = new Parser(opts);
        const csv = parser.parse(expenses);

        res.header('Content-Type', 'text/csv');
        res.attachment('balance-sheet.csv');
        res.send(csv);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;

