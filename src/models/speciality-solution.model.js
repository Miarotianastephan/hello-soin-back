const { DataTypes } = require('sequelize');
const sequelize = require('../config/database').sequelize;

const SpecialitySolution = sequelize.define('SpecialitySolution', {
    id_speciality_solution: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_speciality: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_solution: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    validated_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    validation_type: {
      type: DataTypes.STRING(11),
      allowNull: true,
      defaultValue: 'Pending'
    },
    validated_by: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
}, {
    tableName: 'speciality_solutions',
    timestamps: false
});

module.exports = SpecialitySolution;