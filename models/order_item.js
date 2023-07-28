"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Order_item extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Order_item.init(
    {
      item_id: DataTypes.INTEGER,
      amount: DataTypes.INTEGER,
      state: {
        allowNull: false,
        type: DataTypes.ENUM("ORDERED", "PENDING", "COMPLETED", "CANCELED"),
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: "Order_item",
    }
  );
  return Order_item;
};
