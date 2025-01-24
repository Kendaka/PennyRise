const express = require('express');
const session = require('express-session');
const passport = require('passport');
const userRoutes = require('./routes/userRoutes');
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
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/users', userRoutes);

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