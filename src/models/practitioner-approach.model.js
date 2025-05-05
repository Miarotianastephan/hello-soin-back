const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const PractitionerApproach = sequelize.define('PractitionerApproach', {
    id_pract_approach: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    id_pract_info: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_trouble: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_solution: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_pract_speciality: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'practitioner_approaches',
    timestamps: false
  });

  module.exports = PractitionerApproach;