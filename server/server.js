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
const allowedOrigins = [
  'https://personal-finance-2ant5sf2e-vadyms-projects-dfb6f76f.vercel.app'
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200,
  credentials: true // Если вам нужно передавать куки
};

app.use(cors(corsOptions));

// Middleware для добавления CORS-заголовков ко всем маршрутам
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://personal-finance-2ant5sf2e-vadyms-projects-dfb6f76f.vercel.app");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

// Обслуживание статических файлов
app.use(express.static(path.join(__dirname, 'public')));

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
