// categories.js
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { check, validationResult } = require('express-validator');
const Category = require('../model/Category');

// @route   GET api/categories
// @desc    Get all categories for current user
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const categories = await Category.find({ user: req.user.id });
        res.json(categories);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   POST api/categories/create
// @desc    Create a new category
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

    const { name, type } = req.body;

    try {
        const newCategory = new Category({
            name,
            type,
            user: req.user.id
        });

        const category = await newCategory.save();
        res.json(category);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   PUT api/categories/:id
// @desc    Update a category
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

    const { name, type } = req.body;

    try {
        let category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ msg: 'Category not found' });
        }

        // Проверка, является ли пользователь владельцем категории
        if (category.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        category.name = name;
        category.type = type;

        await category.save();
        res.json(category);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   DELETE api/categories/:id
// @desc    Delete a category
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        let category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ msg: 'Category not found' });
        }

        // Проверка, является ли пользователь владельцем категории
        if (category.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await category.remove();
        res.json({ msg: 'Category removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
