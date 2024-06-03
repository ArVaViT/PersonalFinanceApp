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
        check('name', 'Name is required').not().isEmpty(),
        check('targetAmount', 'Target amount is required').isNumeric(),
        check('currentAmount', 'Current amount must be a number').isNumeric().optional(),
        check('deadline', 'Deadline must be a valid date').optional().isISO8601()
    ]
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, targetAmount, currentAmount, deadline } = req.body;

    try {
        const newGoal = new Goal({
            name,
            targetAmount,
            currentAmount: currentAmount || 0,
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

// @route   PUT api/goals/:id
// @desc    Update a goal
// @access  Private
router.put('/:id', [
    auth,
    [
        check('name', 'Name is required').not().isEmpty(),
        check('targetAmount', 'Target amount is required').isNumeric(),
        check('currentAmount', 'Current amount must be a number').isNumeric().optional(),
        check('deadline', 'Deadline must be a valid date').optional().isISO8601()
    ]
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, targetAmount, currentAmount, deadline } = req.body;

    try {
        let goal = await Goal.findById(req.params.id);
        if (!goal) {
            return res.status(404).json({ msg: 'Goal not found' });
        }

        // Ensure user owns the goal
        if (goal.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        goal.name = name;
        goal.targetAmount = targetAmount;
        goal.currentAmount = currentAmount;
        goal.deadline = deadline;

        await goal.save();
        res.json(goal);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   DELETE api/goals/:id
// @desc    Delete a goal
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        let goal = await Goal.findById(req.params.id);
        if (!goal) {
            return res.status(404).json({ msg: 'Goal not found' });
        }

        // Ensure user owns the goal
        if (goal.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await goal.remove();
        res.json({ msg: 'Goal removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
