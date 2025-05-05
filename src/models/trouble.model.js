const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Trouble = sequelize.define('Trouble', {
    id_trouble: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    designation: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true
    },
    id_trouble_category: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'troubles',
    timestamps: false
});

module.exports = Trouble;