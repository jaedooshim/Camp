const express = require("express");
const router = express.Router();
const User = require("../schemas/user");
const jwt = require("jsonwebtoken");

// 로그인 API
router.post("/login", async (req, res) => {
  const { nickname, password } = req.body; // 닉네임, 비밀번호를 request에서 전달받기

  // 닉네임이 일치하는 유저를 찾는다.
  const user = await User.findOne({ nickname });

  // 전달받은 password와 유저의 패스워드가 다를때, 상태(412)를 띄어 에러메세지 발생
  if (!user || password !== user.password) {
    // try ~ catch문 하기!!
    res
      .status(412)
      .json({ errorMessage: "닉네임 또는 패스워드를 확인해주세요." });
    return;
  }

  // JWT를 생성
  const token = jwt.sign({ userId: user.userId }, "customized-secret-key");
  //   console.log(token);
  // 로그인이 jwt를 활용하여 token에 담고 이 정보를 클라이언트에게 cookie로 전달
  console.log(token);
  res.cookie("Authorization", `Bearer ${token}`);
  res.status(200).json({ token });
});

module.exports = router;
