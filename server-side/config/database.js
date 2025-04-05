const { Sequelize } = require('sequelize');
require('dotenv').config();

console.log('DB_HOST:', process.env.DB_HOST); // Add this line for debugging

const sequelize = new Sequelize(process.env.DB_HOST, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    }
  }
});

module.exports = sequelize;
