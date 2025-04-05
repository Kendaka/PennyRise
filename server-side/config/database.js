const { Sequelize } = require('sequelize');
require('dotenv').config();

console.log('DB_HOST:', process.env.DB_HOST); 

const sequelize = new Sequelize(process.env.DB_HOST, {
  dialect: 'postgres', 
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    }
  }
});

module.exports = sequelize;
