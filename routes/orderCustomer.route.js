const express = require("express");
const router = express.Router();
const { item_order_customer, order_customer, item, sequelize, option } = require("../models");
const { orderCustomerValid, updateOrderCustomerValid } = require("../middlewares/ordersCustomerVaildation");
const { CustomError } = require("../_utils/customClass");

/** @상품주문ID발급 */
router.post("/ordercustomer", orderCustomerValid, async (req, res) => {
  try {
    const { orderArray } = req.body;

    for (const order of orderArray) {
      const findByItem = await item.findOne({ where: { id: order.itemId }, include: [{ model: option }] });
      if (!findByItem) throw new CustomError("존재하지 않는 상품입니다.", 404);
      if (findByItem.amount < order.amount) throw new CustomError(`${findByItem.name} 상품의 재고가 부족합니다. 현재 주문 가능한 수량은 ${findByItem.amount} 입니다.`, 403);
      if (findByItem.option.extraPrice == 0 && order.option.extraPrice !== 0) throw new CustomError("해당 상품은 사이즈업이 불가능합니다.", 403);
      if (findByItem.option.shotPrice == 0 && order.option.shotPrice !== 0) throw new CustomError("해당 상품은 샷 추가가 불가능합니다.", 403);
      if (findByItem.option.hot == false && order.option.hot == true) throw new CustomError("해당 상품은 핫 옵션이 불가합니다.", 403);

      order.price = findByItem.price;
    }

    await sequelize.transaction(async (transaction) => {
      const createOrder = await order_customer.create({ state: 0 }, { transaction });
      for (const order of orderArray) {
        await item_order_customer.create({ orderCustomerId: createOrder.id, itemId: order.itemId, amount: order.amount, option: order.option, price: order.price }, { transaction });
      }

      return res.status(201).json({ message: `주문이 완료되었으며, 고객님의 주문번호는 ${createOrder.id}입니다.` });
    });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ message: err.message });
    console.error(err);
    return res.status(500).json({ message: "오류가 발생하였습니다." });
  }
});

/**@주문상태_변경 */
router.put("/ordercustomer/:orderCustomerId", updateOrderCustomerValid, async (req, res) => {
  try {
    const orderCustomerId = parseInt(req.params.orderCustomerId);
    const { state } = req.body;
    if (!orderCustomerId) throw new CustomError("주문ID가 올바르지않습니다.", 400);

    const existOrder = await order_customer.findOne({ where: { id: orderCustomerId } });
    if (!existOrder) throw new CustomError("id가 존재하지 않습니다.", 404);
    if (!state) throw new CustomError("상태를 입력해주세요.", 404);

    await order_customer.update({ state }, { where: { id: orderCustomerId } });
    return res.status(200).json({ message: `주문${orderCustomerId} 업데이트완료`, state });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ message: err.message });
    console.error(err);
    return res.status(500).json({ message: "오류가 발생하였습니다." });
  }
});
module.exports = router;
