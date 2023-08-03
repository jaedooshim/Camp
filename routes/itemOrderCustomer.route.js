const express = require("express");
const router = express.Router();
const models = require("../models");
const { CustomError } = require("../_utils/customClass");
const { createItemOrderValid } = require("../middlewares/itemOrderCustomerValidation");

/**@주문상세_아이템목록 */
router.post("/item_order", createItemOrderValid, async (req, res) => {
  try {
    const { orderCustomerId, itemId, amount, option, optionId } = req.body;
    const optionJSON = JSON.stringify(option);

    const items = await models.item.findByPk(itemId);
    const itemOption = await models.option.findByPk(optionId);

    if (!items || !itemOption) throw new CustomError("itemId와 optionId를 확인해주세요.", 404);

    const sumPrice = items.price + itemOption.price;
    console.log(items.price, itemOption.price);

    const itemOrder = await models.item_order_customer.create({
      orderCustomerId,
      itemId,
      amount,
      option: optionJSON,
      price: sumPrice,
    });
    return res.status(201).json({ message: itemOrder });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ message: err.message });
    console.error(err);
    return res.status(500).json({ message: "오류 발생", err });
  }
});

module.exports = router;
