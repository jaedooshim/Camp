"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class option extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.item, {
        targetKey: "id",
        foreignKey: "optionId",
      });
    }
  }
  option.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT,
      },
      extraPrice: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      shotPrice: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      hot: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "option",
    }
  );
  return option;
};
