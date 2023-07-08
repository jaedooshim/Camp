const express = require("express");
const { Users } = require("../models");
const router = express.Router();
const jwt = require("jsonwebtoken");

// 회원가입 API
router.post("/signup", async (req, res) => {
  const { nickname, password, confirm } = req.body;
  const isExistUser = await Users.findOne({
    where: {
      nickname: nickname,
    },
  });
  if (isExistUser) return res.status(412).json({ errorMessage: " 중복된 닉네임입니다." }); // 존재하는 닉네임이 있을때
  if (password !== confirm) return res.status(412).json({ errorMessage: "패스워드가 일치하지 않습니다." }); // 비밀번호와 비밀번호확인이 다를때
  if (password.includes(nickname)) return res.status(412).json({ errorMessage: "패스워드에 닉네임이 포함되어있습니다." }); // 패스워드에 닉네임이 포함될때

  // 사용자 테이블에 데이터 삽입
  const user = await Users.create({ nickname, password });
  return res.status(201).json({ message: "회원 가입에 성공하였습니다." });
});

// 로그인 API
router.post("/login", async (req, res) => {
  const { nickname, password } = req.body;
  const user = await Users.findOne({
    where: { nickname },
  });
  if (!user) return res.status(412).json({ errorMessage: "닉네임 또는 패스워드를 확인해주세요." }); // 해당 닉네임이 없는경우
  if (password !== user.password) return res.status(412).json({ errorMessage: "패스워드를 확인해주세요." }); // 비밀번호가 틀린 경우

  // jwt 생성
  const token = jwt.sign(
    {
      userId: user.userId,
    },
    "secret_key"
  );
  // 쿠키 발급
  res.cookie("authorization", `Bearer ${token}`);
  // response 할당
  return res.status(200).json({ message: "로그인에 성공하였습니다." });
});

module.exports = router;
