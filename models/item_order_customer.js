"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Item_order_customer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Item, { foreignKey: "Item_id" });
      this.belongsTo(models.Order_customer, { foreignKey: "Order_customer_id" });
    }
  }
  Item_order_customer.init(
    {
      Item_id: DataTypes.INTEGER,
      Order_customer_id: DataTypes.INTEGER,
      amount: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Item_order_customer",
    }
  );
  return Item_order_customer;
};
