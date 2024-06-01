const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Загрузка переменных окружения из .env файла
dotenv.config();

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (err) {
        console.error('bad auth : authentication failed');
        process.exit(1);
    }
};

module.exports = connectDB;
