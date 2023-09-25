const express = require("express");
const router = express.Router();
const { order_item, item, sequelize } = require("../models");
const { CustomError } = require("../_utils/customClass");

/**@상품발주 */
router.post("/order/item/:itemId", async (req, res) => {
  try {
    const { itemId } = req.params;
    const { amount } = req.body;

    const createOrder = await order_item.create({ itemId, amount, state: 0 });
    return res.status(201).json({ message: createOrder });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "발주 실패" });
  }
});

/**@발주상태_수정 */
router.put("/order/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;
    const { state } = req.body;

    const orderItemState = { ORDERED: 0, PENDING: 1, COMPLETED: 2, CANCELED: 3 };

    const findOrder = await order_item.findOne({ where: { id: orderId }, include: [{ model: item }] });
    if (!findOrder) throw new CustomError("존재하지 않는 발주입니다.", 404);
    if (findOrder.state == 2) throw new CustomError("이미 종료된 발주입니다.", 403);
    if (findOrder.state == 3) throw new CustomError("취소 된 발주는 상태 변경이 불가합니다.", 403);

    if (orderItemState[state] == 2) {
      await sequelize.transaction(async (transaction) => {
        await order_item.update({ state: orderItemState[state] }, { where: { id: orderId } }, { transaction });
        await item.update({ amount: findOrder.amount + findOrder.item.amount }, { where: { id: findOrder.itemId } }, { transaction });
      });
    } else {
      if (findOrder.state == orderItemState[state]) throw new CustomError("요청하신 상태값이 현재 상태값과 동일합니다.", 403);
      await order_item.update({ state: orderItemState[state] }, { where: { id: orderId } });
    }
    return res.status(200).json({ message: "발주상태가 정상 수정되었습니다." });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ message: err.message });
    console.error(err);
    return res.status(500).json({ message: "발주상태 수정 실패" });
  }
});

module.exports = router;
