"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class item_order_customer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.item, {
        targetKey: "id",
        foreignKey: "itemId",
      });

      this.belongsTo(models.order_customer, {
        targetKey: "id",
        foreignKey: "orderCustomerId",
      });
    }
  }
  item_order_customer.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT,
      },
      orderCustomerId: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      itemId: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      option: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "item_order_customer",
    }
  );
  return item_order_customer;
};
