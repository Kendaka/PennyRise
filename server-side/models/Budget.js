const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

// This model defines the Budget entity, which is associated with a User
const Budget = sequelize.define('Budget', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  allocated: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  spent: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id',
    },
  },
}, {
  timestamps: true,
});

User.hasMany(Budget, { foreignKey: 'userId' }); // A User can have multiple Budgets
Budget.belongsTo(User, { foreignKey: 'userId' });

module.exports = Budget;