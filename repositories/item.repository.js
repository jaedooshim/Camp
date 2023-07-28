const { Item } = require("../models");
const { Op } = require("sequelize");
const { Sequelize } = require("sequelize");
const { RelationshipType } = require("sequelize/types/errors/database/foreign-key-constraint-error");

class ItemsRepository {
  // 상품(item) 등록
  createItem = async ({ Option_id, name, price, type }) => {
    return await Item.create({
      Option_id,
      name,
      price,
      type,
    });
  };

  // 상품(item) 조회
  findItem = async () => {
    return await Item.findAll({
      attributes: ["Option_id", "name", "price", "type", "createdAt", "updatedAt", "amount"],
      order: [["createdAt", "DESC"]],
      group: ["Item.type"],
    });
  };

  // 타입(type)별 조회
  typeItem = async (type) => {
    return await Item.findOne({
      where: { Option_id },
      attributes: ["OptionId", "name", "price", "type", "createdAt", "updatedAt", "amount"],
    });
  };

  // 상품(item) 수정
  // 수정할 아이디 찾음
  findByIdItem = async ({ Option_id }) => {
    return await Item.findOne({
      where: { Option_id: Option_id },
    });
  };

  // 수정하는 단계
  modifyItem = async ({ Option_id, name, price, amount }) => {
    return await Item.update(
      { name, price, amount },
      {
        where: {
          [Op.and]: [{ Option_id }],
        },
      }
    );
  };

  // 상품(item) 삭제
  deleteItem = async ({ Option_id }) => {
    return await Item.destroy({
      where: {
        [Op.and]: [{ Option_id }],
      },
    });
  };
}

module.exports = ItemsRepository;
