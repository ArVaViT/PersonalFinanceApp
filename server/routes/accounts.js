// accounts.js
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { check, validationResult } = require('express-validator');
const Account = require('../model/Account');

// @route   GET api/accounts
// @desc    Get all accounts for current user
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const accounts = await Account.find({ user: req.user.id });
        res.json(accounts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   POST api/accounts/create
// @desc    Create a new account
// @access  Private
router.post('/create', [
    auth, 
    [
        check('name', 'Name is required').not().isEmpty(),
        check('type', 'Type is required').not().isEmpty()
    ]
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, type, balance } = req.body;

    try {
        const newAccount = new Account({
            name,
            type,
            balance,
            user: req.user.id
        });

        const account = await newAccount.save();
        res.json(account);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   PUT api/accounts/:id
// @desc    Update an account
// @access  Private
router.put('/:id', [
    auth, 
    [
        check('name', 'Name is required').not().isEmpty(),
        check('type', 'Type is required').not().isEmpty()
    ]
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, type, balance } = req.body;

    try {
        let account = await Account.findById(req.params.id);
        if (!account) {
            return res.status(404).json({ msg: 'Account not found' });
        }

        // Проверка, является ли пользователь владельцем счета
        if (account.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        account.name = name;
        account.type = type;
        account.balance = balance;

        await account.save();
        res.json(account);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   DELETE api/accounts/:id
// @desc    Delete an account
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        let account = await Account.findById(req.params.id);
        if (!account) {
            return res.status(404).json({ msg: 'Account not found' });
        }

        // Проверка, является ли пользователь владельцем счета
        if (account.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await account.remove();
        res.json({ msg: 'Account removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
