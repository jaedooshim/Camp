const Joi = require("joi");

const Validations = {
  createValid: async (req, res, next) => {
    const body = req.body;
    const schema = Joi.object().keys({
      extraPrice: Joi.number().empty().required(),
      shotPrice: Joi.number().empty().required(),
      hot: Joi.boolean().empty().required(),
    });

    try {
      await schema.validateAsync(body);
    } catch (err) {
      return res.status(412).json({ message: err.message });
    }

    next();
  },
};

module.exports = Validations;
