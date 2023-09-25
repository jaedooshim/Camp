"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class item extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.option, {
        targetKey: "id",
        foreignKey: "optionId",
      });
      this.hasMany(models.order_item, {
        targetKey: "id",
        foreignKey: "itemId",
      });
      this.hasMany(models.item_order_customer, {
        targetKey: "id",
        foreignKey: "itemId",
      });
    }
  }
  item.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT,
      },
      optionId: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      name: { type: DataTypes.STRING, allowNull: false },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM("COFFEE", "JUICE", "FOOD"),
        allowNull: false,
      },
      amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "item",
    }
  );
  return item;
};
