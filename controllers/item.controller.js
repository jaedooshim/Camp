const ItemsService = require("../services/item.service");

class ItemsController {
  itemsService = new ItemsService();

  // 상품(item) 등록
  createItem = async (req, res) => {
    try {
      const { Option_id } = res.params;
      const { name, price, type } = req.body;

      const item = await this.itemsService.createItem({
        Option_id,
        name,
        price,
        type,
      });
      return res.status(200).json({ item });
    } catch (err) {
      if (err.code) return res.status(err.code).json({ message: err.data });
      return res.status(500).json({ message: "오류 발생" });
    }
  };
  // 상품(item) 조회
  findItem = async (req, res) => {
    try {
      const { code, data } = await this.itemsService.findItem();
      res.status(code).json({ data });
    } catch (err) {
      if (err.code) return res.status(err.code).json({ message: err.data });
      console.error(error);
      return res.status(500).json({ message: "오류발생" });
    }
  };

  // 타입(type)별로 조회
  typeItem = async (req, res) => {
    try {
      const { type } = req.params;
      const { code, data } = await this.itemsService.typeItem(type);
      res.status(code).json({ data });
    } catch (err) {
      if (err.code) return res.status(err.code).json({ message: err.data });
      console.error(err);
      return res.status(500).json({ message: "오류발생" });
    }
  };

  // 상품(item) 수정
  modifyItem = async (req, res) => {
    try {
      const { Option_id } = req.params;
      const { name, price } = req.body;
      const { code, data } = await this.itemsService.modifyItem({ Option_id, name, price });
      res.status(code).json({ data });
    } catch (err) {
      if (err.code) return res.status(err.code).json({ message: err.data });
      console.error(err);
      return res.status(500).json({ message: "오류발생" });
    }
  };

  // 상품(item) 삭제
  deleteItem = async (req, res) => {
    try {
      const { Option_id } = req.params;
      const { code, data } = await this.itemsService.deleteItem({
        Option_id,
      });
      res.status(code).json({ data });
    } catch (err) {
      if (err.code) return res.status(err.code).json({ message: data });
      return res.status(500).json({ message: "오류발생" });
    }
  };
}

module.exports = ItemsController;
