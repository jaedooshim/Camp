const { text } = require("express");
const ItemsRepository = require("../repositories/item.repository");
const item = require("../models/item");

class ItemsService {
  itemsRepository = new ItemsRepository();

  // 상품(item) 등록
  createItem = async ({ Option_id, name, price, type }) => {
    const item = await this.itemsRepository.createItem({
      Option_id,
      name,
      price,
      type,
    });
    if (!Option_id) throw { code: 400, data: "상품 등록에 실패하였습니다." };
    if (!name || !price) throw { code: 404, data: "이름 또는 가격을 지정해주세요." };
    return { code: 200, data: item };
  };

  // 상품(item) 조회
  findItem = async () => {
    const items = await this.itemsRepository.findItem();

    if (items) throw { code: 400, data: "상품 조회에 실패하였습니다." };
    return { code: 200, data: items };
  };

  // 타입(type)별로 조회
  typeItem = async (type) => {
    const item = await this.itemsRepository.typeItem(type);
    if (!type) throw { code: 404, data: "상품이 존재하지 않습니다." };
    return { code: 200, data: item };
  };

  // 상품(item) 수정
  modifyItem = async ({ Option_id, name, price, amount }) => {
    const item = await this.itemsRepository.findByIdItem({ Option_id });
    if (!item) throw { code: 404, data: "상품이 존재하지 않습니다." };
    if (!name || name.trim() === "") throw { code: 404, data: "이름을 입력해주세요" }; // name.trim() => 문자열의 앞뒤 공백제거
    if (!price || price < 0) throw { code: 404, data: "가격을 적어주세요" };

    // 상품 수정하는 단계
    await this.itemsRepository.modifyItem({ Option_id, name, price, amount });
    return { code: 200, data: item };
  };

  // 상품(item) 삭제
  deleteItem = async ({ Option_id }) => {
    const item = await this.itemsRepository.findByIdItem({ Option_id });
    if (!item) throw { code: 404, data: "상품이 존재하지 않습니다." };

    // 상품 삭제하는 단계
    await this.itemsRepository.deleteItem({ Option_id });
    return { code: 200, data: "상품 삭제 성공" };
  };
}

module.exports = ItemsService;
