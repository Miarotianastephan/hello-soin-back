const { DataTypes } = require('sequelize');
const sequelize = require('../config/database').sequelize;

const Solution = sequelize.define('Solution', {
    id_solution: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    designation: {
      type: DataTypes.STRING(128),
      allowNull: false
    }
}, {
    tableName: 'solutions',
    timestamps: false
});

module.exports = Solution;