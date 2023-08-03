const express = require("express");
const router = express.Router();
const { item, option, sequelize } = require("../models");
const { createItemValid, updateItemValid, deleteItemValid } = require("../middlewares/itemsValidation.js");
const { CustomError } = require("../_utils/customClass");

/** 메뉴 생성 */
router.post("/item", createItemValid, async (req, res) => {
  try {
    const { name, price, type, optionId } = req.body;
    const findByItem = await item.findOne({ where: { name } });
    if (findByItem) throw new CustomError("이미 생성된 메뉴입니다.", 403);

    const findByOption = await option.findOne({ where: { id: optionId } });
    if (!findByOption) throw new CustomError("존재하지 않는 옵션입니다.", 404);

    await item.create({ name, price, type, amount: 0, optionId });
    return res.status(201).json({ message: "상품이 정상 등록되었습니다." });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ message: err.message });
    console.error(err);
    return res.status(500).json({ message: "오류가 발생하였습니다." });
  }
});

/** 메뉴 수정 */
router.put("/item/:id", updateItemValid, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, type, optionId } = req.body;

    const findByItem = await item.findOne({ where: { id } });
    if (!findByItem) throw new CustomError("상품이 존재하지 않습니다.", 404);
    await item.update({ name, price, type, optionId }, { where: { id } });

    return res.status(200).json({ message: "상품이 정상 수정되었습니다." });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ message: err.message });
    console.error(err);
    return res.status(500).json({ message: "오류가 발생하였습니다." });
  }
});

/** 메뉴 삭제 */
router.delete("/item/:id", deleteItemValid, async (req, res) => {
  try {
    const { id } = req.params;

    const findByItem = await item.findOne({ where: { id } });
    if (!findByItem) throw new CustomError("상품이 존재하지 않습니다.", 404);
    await item.destroy({ where: { id } });
    return res.status(200).json({ message: "상품이 정상 삭제되었습니다." });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ message: err.message });
    console.error(err);
    return res.status(500).json({ message: "오류가 발생하였습니다." });
  }
});

/** 메뉴 목록 */
router.get("/item", async (req, res) => {
  try {
    const findByItems = await item.findAll({ include: [{ model: option }] });
    return res.status(200).json(findByItems);
  } catch (err) {
    if (err.status) return res.status(err.status).json({ message: err.message });
    console.error(err);
    return res.status(500).json({ message: "오류가 발생하였습니다." });
  }
});

module.exports = router;
