// Description: This is the main entry point for the server-side application. It sets up the Express server, connects to the database, and defines the routes for the application.
const express = require('express');
const path = require('path');
const session = require('express-session');
const userRoutes = require('./routes/userRoutes');
const budgetRoutes = require('./routes/budgetRoutes'); 
const transactionRoutes = require('./routes/transactionRoutes'); 
const savingsRoutes = require('./routes/savingsRoutes'); 
const cors = require('cors');
const sequelize = require('./config/database');
require('dotenv').config();
require('./config/passport'); 
  
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware for CORS
const corsOptions = {
  origin: 'https://prise-coral.vercel.app',
  credentials: true, 
};

// Apply CORS middleware
app.use(cors(corsOptions)); 

// Middleware for parsing JSON and handling sessions
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
}));

app.use('/api/users', userRoutes); // Define the routes for user-related operations
app.use('/api/budgets', budgetRoutes); // Define the routes for budget-related operations
app.use('/api/transactions', transactionRoutes); // Define the routes for transaction-related operations
app.use('/api/savings', savingsRoutes); // Define the routes for savings-related operations
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve static files from the uploads directory

sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .then(() => {
    console.log('Database synchronized.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
