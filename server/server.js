// server.js
const express = require('express');
const connectDB = require('./db');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Підключення до бази даних
connectDB();

// Middleware для обробки JSON
app.use(express.json({ extended: false }));

// Настройки CORS для безопасности
const corsOptions = {
    origin: 'http://localhost:3000', // Укажите адрес фронтенда
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Маршрути API
app.use('/api/auth', require('./routes/auth')); // Аутентифікація
app.use('/api/users', require('./routes/users')); // Управління профілем
app.use('/api/accounts', require('./routes/accounts')); // Управління рахунками
app.use('/api/categories', require('./routes/categories')); // Управління категоріями
app.use('/api/transactions', require('./routes/transactions')); // Управління транзакціями
app.use('/api/goals', require('./routes/goals')); // Управління цілями 
app.use('/api/reminders', require('./routes/reminders')); // Управління нагадуваннями

// Middleware для глобальної обробки помилок
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Запуск сервера
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
