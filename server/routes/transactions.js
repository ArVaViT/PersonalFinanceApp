const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { check, validationResult } = require('express-validator');
const Transaction = require('../model/Transaction');

// @route   GET api/transactions
// @desc    Get all transactions for current user
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const transactions = await Transaction.find({ user: req.user.id }).populate('category').populate('account');
        res.json(transactions);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   POST api/transactions/create
// @desc    Create a transaction
// @access  Private
router.post('/create', [
    auth,
    [
        check('amount', 'Amount is required').isNumeric(),
        check('date', 'Date is required').isISO8601()
    ]
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { amount, date, description, category, account } = req.body;

    try {
        // Ensure category and account are provided
        if (!category || !account) {
            return res.status(400).json({ msg: 'Category and account are required' });
        }

        const newTransaction = new Transaction({
            amount,
            date,
            description,
            category,
            account,
            user: req.user.id
        });

        const transaction = await newTransaction.save();
        res.json(transaction);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   PUT api/transactions/:id
// @desc    Update a transaction
// @access  Private
router.put('/:id', [
    auth,
    [
        check('amount', 'Amount is required').isNumeric(),
        check('date', 'Date is required').isISO8601()
    ]
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { amount, date, description, category, account } = req.body;

    try {
        let transaction = await Transaction.findById(req.params.id);
        if (!transaction) {
            return res.status(404).json({ msg: 'Transaction not found' });
        }

        // Ensure user owns the transaction
        if (transaction.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        transaction.amount = amount;
        transaction.date = date;
        transaction.description = description;
        transaction.category = category;
        transaction.account = account;

        await transaction.save();
        res.json(transaction);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   DELETE api/transactions/:id
// @desc    Delete a transaction
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        let transaction = await Transaction.findById(req.params.id);
        if (!transaction) {
            return res.status(404).json({ msg: 'Transaction not found' });
        }

        // Ensure user owns the transaction
        if (transaction.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await transaction.remove();
        res.json({ msg: 'Transaction removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
