const express = require('express');
const path = require('path');
const connectDB = require('./db');
const cors = require('cors');
const config = require('config');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware для обработки JSON
app.use(express.json({ extended: false }));

// Настройки CORS для безопасности
const corsOptions = {
    origin: 'https://your-vercel-app-name.vercel.app', // Укажите точный адрес вашего фронтенда для продакшена
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Обслуживание статических файлов
app.use(express.static(path.join(__dirname, 'public')));  // <-- добавьте эту строку

// Корневой маршрут
app.get('/', (req, res) => {
    res.send('API is running');
});

// Подключение к базе данных
connectDB().then(() => {
    console.log('MongoDB Connected...');
}).catch(err => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
});

// Маршруты API
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/accounts', require('./routes/accounts'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/transactions', require('./routes/transactions'));
app.use('/api/goals', require('./routes/goals'));
app.use('/api/reminders', require('./routes/reminders'));

// Middleware для глобальной обработки ошибок
app.use((err, req, res, next) => {
    console.error('Error message:', err.message);
    console.error('Error stack:', err.stack);
    res.status(500).send('Something broke!');
});

// Запуск сервера
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

module.exports = app;
