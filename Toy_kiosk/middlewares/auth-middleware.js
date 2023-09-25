// 사용자 인증 미들웨어
const jwt = require("jsonwebtoken");
const { Users } = require("../models");

module.exports = async (req, res, next) => {
  try {
    const { authorization } = req.cookies;
    const [tokenType, token] = authorization.split(" ");
    if (tokenType !== "Bearer" || !token) {
      return res.status(401).json({ message: "토큰이 일치하지 않거나, 토큰이 존재하지 않습니다" });
    }
    const decodedToken = jwt.verify(token, "secret_key");
    const userId = decodedToken.userId;

    const user = await Users.findOne({ where: userId });
    if (!user) return res.status(401).json({ message: "토큰에 해당하는 사용자가 존재하지 않습니다." });

    res.locals.user = user; // 전역으로 돌림
    // console.log(res.locals.user);
    next();
  } catch (error) {
    return res.status(400).json({ message: "비정상적인 접근입니다." });
  }
};
