// reminders.js
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { check, validationResult } = require('express-validator');
const Reminder = require('../model/Reminder');

// @route   GET api/reminders
// @desc    Get all reminders for current user
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const reminders = await Reminder.find({ user: req.user.id });
        res.json(reminders);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   POST api/reminders/create
// @desc    Create a new reminder
// @access  Private
router.post('/create', [
    auth, 
    [
        check('title', 'Title is required').not().isEmpty(),
        check('date', 'Date is required').not().isEmpty(),
        check('time', 'Time is required').not().isEmpty()
    ]
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { title, date, time, recurring } = req.body;

    try {
        const newReminder = new Reminder({
            title,
            date,
            time,
            recurring,
            user: req.user.id
        });

        const reminder = await newReminder.save();
        res.json(reminder);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   PUT api/reminders/:id
// @desc    Update a reminder
// @access  Private
router.put('/:id', [
    auth, 
    [
        check('title', 'Title is required').not().isEmpty(),
        check('date', 'Date is required').not().isEmpty(),
        check('time', 'Time is required').not().isEmpty()
    ]
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { title, date, time, recurring } = req.body;

    try {
        let reminder = await Reminder.findById(req.params.id);
        if (!reminder) {
            return res.status(404).json({ msg: 'Reminder not found' });
        }

        // Проверка, является ли пользователь владельцем напоминания
        if (reminder.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        reminder.title = title;
        reminder.date = date;
        reminder.time = time;
        reminder.recurring = recurring;

        await reminder.save();
        res.json(reminder);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   DELETE api/reminders/:id
// @desc    Delete a reminder
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        let reminder = await Reminder.findById(req.params.id);
        if (!reminder) {
            return res.status(404).json({ msg: 'Reminder not found' });
        }

        // Проверка, является ли пользователь владельцем напоминания
        if (reminder.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await reminder.remove();
        res.json({ msg: 'Reminder removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
