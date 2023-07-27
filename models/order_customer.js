"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Order_customer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.Item_order_customer, { foreignKey: "Order_customer_id" });
    }
  }
  Order_customer.init(
    {
      state: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Order_customer",
    }
  );
  return Order_customer;
};
