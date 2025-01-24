const express = require('express');
const session = require('express-session');
const userRoutes = require('./routes/userRoutes');
const budgetRoutes = require('./routes/budgetRoutes'); 
const transactionRoutes = require('./routes/transactionRoutes'); 
const savingsRoutes = require('./routes/savingsRoutes'); 
const cors = require('cors');
const sequelize = require('./config/database');
require('dotenv').config();
require('../server-side/config/passport'); 

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
}));

app.use('/api/users', userRoutes); 
app.use('/api/budgets', budgetRoutes); 
app.use('/api/transactions', transactionRoutes); 
app.use('/api/savings', savingsRoutes); 

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
