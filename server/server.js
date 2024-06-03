const express = require('express');
const path = require('path');
const connectDB = require('./db');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
const allowedOrigins = [
  'https://personal-finance-app-git-master-vadyms-projects-dfb6f76f.vercel.app',
  'https://personal-finance-lrud3l38t-vadyms-projects-dfb6f76f.vercel.app'
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
  credentials: true
};

app.use(cors(corsOptions));

// Middleware for JSON parsing
app.use(express.json({ extended: false }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Root route
app.get('/', (req, res) => {
  res.send('API is running');
});

// Connect to the database
connectDB().then(() => {
  console.log('MongoDB Connected...');
}).catch(err => {
  console.error('Failed to connect to MongoDB:', err);
  process.exit(1);
});

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/accounts', require('./routes/accounts'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/transactions', require('./routes/transactions'));
app.use('/api/goals', require('./routes/goals'));
app.use('/api/reminders', require('./routes/reminders'));

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Error message:', err.message);
  console.error('Error stack:', err.stack);
  res.status(500).send('Something broke!');
});

// Start the server
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

module.exports = app;
