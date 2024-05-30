// server/model/Account.js
const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['bank', 'cash', 'e-wallet'],
        required: true
    },
    balance: {
        type: Number,
        default: 0
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

const Account = mongoose.model('Account', accountSchema);

module.exports = Account;
