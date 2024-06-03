const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { check, validationResult } = require('express-validator');
const Goal = require('../model/Goal');

// @route   GET api/goals
// @desc    Get all goals for current user
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const goals = await Goal.find({ user: req.user.id });
        if (!goals) {
            return res.status(404).json({ msg: 'No goals found for this user' });
        }
        res.json(goals);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   POST api/goals/create
// @desc    Create a goal
// @access  Private
router.post('/create', [
    auth,
    [
        check('title', 'Title is required').not().isEmpty(),
        check('amount', 'Amount is required').isNumeric()
    ]
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { title, amount, deadline } = req.body;

    try {
        const newGoal = new Goal({
            title,
            amount,
            deadline,
            user: req.user.id
        });

        const goal = await newGoal.save();
        res.json(goal);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
