// server/model/Reminder.js
const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    time: { 
        type: String, // Consider using a Date/Time format for better time management 
        required: true
    },
    recurring: {
        type: Boolean,
        default: false
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

const Reminder = mongoose.model('Reminder', reminderSchema);

module.exports = Reminder;
