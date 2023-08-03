const Joi = require("joi");

const itemValidation = {
  createItemValid: async (req, res, next) => {
    const body = req.body;
    const schema = Joi.object().keys({
      name: Joi.string().empty().required(),
      price: Joi.number().empty().required(),
      type: Joi.string().empty().required().valid("FOOD", "JUICE", "COFFEE"),
      optionId: Joi.number().empty().required(),
    });

    try {
      await schema.validateAsync(body);
    } catch (err) {
      return res.status(412).json({ message: err.message });
    }

    next();
  },
  updateItemValid: async (req, res, next) => {
    const body = req.body;
    const id = req.params.id;
    const schema = Joi.object().keys({
      id: Joi.number().empty().required(),
      name: Joi.string().empty().required(),
      price: Joi.number().empty().required(),
      optionId: Joi.number().empty().required(),
      type: Joi.string().empty().required().valid("FOOD", "JUICE", "COFFEE"),
    });

    try {
      await schema.validateAsync({ id, name: body.name, price: body.price, type: body.type, optionId: body.optionId });
    } catch (err) {
      return res.status(412).json({ message: err.message });
    }

    next();
  },
  deleteItemValid: async (req, res, next) => {
    const id = req.params.id;
    const schema = Joi.object().keys({
      id: Joi.number().empty().required(),
    });

    try {
      await schema.validateAsync({ id });
    } catch (err) {
      return res.status(412).json({ message: err.message });
    }

    next();
  },
};

module.exports = itemValidation;
