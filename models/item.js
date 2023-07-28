"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Item extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.Item_order_customer, { foreignKey: "Item_id" });
      this.belongsTo(models.Option, { foreignKey: "Option_id" });
    }
  }
  Item.init(
    {
      Option_id: DataTypes.INTEGER,
      name: DataTypes.STRING,
      price: DataTypes.INTEGER,
      type: DataTypes.ENUM("COFFEE", "JUICE", "FOOD"),
      amount: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Item",
    }
  );
  return Item;
};
