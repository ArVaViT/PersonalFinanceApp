// models.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, 'is invalid'] // Проверка на валидность email
    },
    password: { 
        type: String,
        required: true,
        minlength: 6 // Минимальная длина пароля
    },
    name: {
        type: String,
        required: true,
        trim: true // Удаление пробелов в начале и конце строки
    }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

const accountSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        enum: ['bank', 'cash', 'e-wallet'],
        required: true
    },
    balance: {
        type: Number,
        default: 0,
        min: 0 // Минимальное значение баланса
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        enum: ['expense', 'income'],
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

const transactionSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true,
        min: 0 // Минимальное значение суммы транзакции
    },
    date: {
        type: Date,
        required: true
    },
    description: {
        type: String,
        trim: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

const goalSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    targetAmount: {
        type: Number,
        required: true,
        min: 0 // Минимальное значение целевой суммы
    },
    currentAmount: {
        type: Number,
        default: 0,
        min: 0 // Минимальное значение текущей суммы
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

const reminderSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
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

// Export all models together
module.exports = {
    User: mongoose.model('User', userSchema),
    Account: mongoose.model('Account', accountSchema),
    Category: mongoose.model('Category', categorySchema),
    Transaction: mongoose.model('Transaction', transactionSchema),
    Goal: mongoose.model('Goal', goalSchema),
    Reminder: mongoose.model('Reminder', reminderSchema)
};
