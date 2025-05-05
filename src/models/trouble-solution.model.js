const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const TroubleSolution = sequelize.define('TroubleSolution', {
    id_trouble_solution: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_trouble: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_solution: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_speciality: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'trouble_solutions',
    timestamps: false
});

module.exports = TroubleSolution;