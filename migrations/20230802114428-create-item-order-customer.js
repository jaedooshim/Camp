"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("item_order_customers", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
        type: Sequelize.BIGINT,
      },
      orderCustomerId: {
        allowNull: false,
        type: Sequelize.BIGINT,
        references: {
          model: "order_customers",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      itemId: {
        allowNull: false,
        type: Sequelize.BIGINT,
        references: {
          model: "items",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      amount: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      option: {
        allowNull: true,
        type: Sequelize.JSON,
      },
      price: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("item_order_customers");
  },
};
