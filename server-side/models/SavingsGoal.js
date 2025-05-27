// SavingsGoal model definition
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

// This model defines the SavingsGoal entity, which is associated with a User
const SavingsGoal = sequelize.define('SavingsGoal', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  target: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  saved: {
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

User.hasMany(SavingsGoal, { foreignKey: 'userId' });
SavingsGoal.belongsTo(User, { foreignKey: 'userId' }); // A User can have multiple SavingsGoals, and a SavingsGoal belongs to a User

module.exports = SavingsGoal;