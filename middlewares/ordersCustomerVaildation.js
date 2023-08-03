const Joi = require("joi");

const Validations = {
  orderCustomerValid: async (req, res, next) => {
    const orderArray = req.body?.orderArray;
    const schema = Joi.object().keys({
      itemId: Joi.number().empty().required(),
      amount: Joi.number().empty().required(),
      option: Joi.object().required().empty().keys({
        extraPrice: Joi.number().empty().required(),
        shotPrice: Joi.number().empty().required(),
        hot: Joi.boolean().empty().required(),
      }),
    });
    try {
      for (const order of orderArray) {
        await schema.validateAsync(order);
      }
    } catch (err) {
      return res.status(412).json({ message: err.message });
    }

    next();
  },
  updateOrderCustomerValid: async (req, res, next) => {
    const body = req.body;
    const orderCustomerId = req.params.orderCustomerId;
    const schema = Joi.object().keys({
      orderCustomerId: Joi.number().empty().required(),
      state: Joi.number().empty().required(),
    });
    try {
      await schema.validateAsync({ orderCustomerId, state: body.state });
    } catch (err) {
      return res.status(412).json({ message: err.message });
    }
    next();
  },
};
module.exports = Validations;
