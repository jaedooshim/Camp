const Joi = require("joi");

const itemOrderCustomerValidation = {
  createItemOrderValid: async (req, res, next) => {
    const body = req.body;
    const schema = Joi.object().keys({
      orderCustomerId: Joi.number().empty().required(),
      itemId: Joi.number().empty().required(),
      amount: Joi.number().empty().required(),
      option: Joi.string().empty().required(),
      optionId: Joi.number().empty().required(),
    });
    try {
      await schema.validateAsync({ orderCustomerId: body.orderCustomerId, itemId: body.itemId, amount: body.amount, option: body.option, optionId: body.optionId });
    } catch (err) {
      return res.status(412).json({ message: err.message });
    }
    next();
  },
};
module.exports = itemOrderCustomerValidation;
