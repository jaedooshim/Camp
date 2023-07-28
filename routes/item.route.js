const express = require("express");

const router = express.Router();
const ItemsController = require("../controllers/item.controller");
const itemsController = new ItemsController();

// 상품 등록
router.post("/items", itemsController.createItem);

// 상품 조회
router.get("/items", itemsController.findItem);

// 타입 조회
router.get("/items/type", itemsController.typeItem);

// 상품 수정
router.put("/items/:OptionId", itemsController.modifyItem);

// 상품 삭제
router.delete("/items/:OptionId", itemsController.deleteItem);
module.exports = router;
