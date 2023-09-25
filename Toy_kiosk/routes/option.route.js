const express = require("express");
const router = express.Router();
const { option } = require("../models");
const { createValid } = require("../middlewares/options.validation");
const { CustomError } = require("../_utils/customClass");
const { Op } = require("sequelize");

/** @옵션생성 */
router.post("/options", createValid, async (req, res) => {
  try {
    const { extraPrice, shotPrice, hot } = req.body;
    const findByOption = await option.findOne({ where: { [Op.and]: [{ extraPrice }, { shotPrice }, { hot }] } });
    if (findByOption) throw new CustomError("이미 등록된 옵션입니다.", 403);
    await option.create({ extraPrice, shotPrice, hot });
    return res.status(201).json({ message: "옵션이 정상 생성되었습니다." });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ message: err.message });
    console.error(err);
    return res.status(500).json({ message: "오류가 발생하였습니다." });
  }
});

module.exports = router;
