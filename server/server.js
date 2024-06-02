const express = require('express');
const connectDB = require('./db');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Подключение к базе данных
connectDB().then(() => {
  console.log('MongoDB Connected...');
}).catch(err => {
  console.error('Failed to connect to MongoDB:', err);
});

// Middleware для обработки JSON
app.use(express.json({ extended: false }));

// Настройки CORS для безопасности
const corsOptions = {
    origin: 'https://personal-finance-app-pi.vercel.app', // Укажите точный адрес вашего фронтенда для продакшена
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Корневой маршрут
app.get('/', (req, res) => {
    res.send('API is running');
});

// Маршруты API
app.use('/api/auth', require('./routes/auth')); // Аутентификация
app.use('/api/users', require('./routes/users')); // Управление профилем
app.use('/api/accounts', require('./routes/accounts')); // Управление счетами
app.use('/api/categories', require('./routes/categories')); // Управление категориями
app.use('/api/transactions', require('./routes/transactions')); // Управление транзакциями
app.use('/api/goals', require('./routes/goals')); // Управление целями
app.use('/api/reminders', require('./routes/reminders')); // Управление напоминаниями

// Middleware для глобальной обработки ошибок
app.use((err, req, res, next) => {
    console.error('Error stack:', err.stack);
    res.status(500).send('Something broke!');
});

// Запуск сервера
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

module.exports = app;
