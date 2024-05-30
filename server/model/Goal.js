// server/model/Goal.js
const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    targetAmount: {
        type: Number,
        required: true
    },
    currentAmount: {
        type: Number,
        default: 0
    },
    deadline: {
        type: Date
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

const Goal = mongoose.model('Goal', goalSchema);

module.exports = Goal;
