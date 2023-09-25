const express = require("express");
const router = express.Router();
const userSchema = require("../schemas/user");
const authMiddleware = require("../middlewares/auth-middleware");

// 회원가입 API
router.post("/signup", async (req, res) => {
  const { nickname, password, confirm } = req.body; // 객체구조분해할당으로 req에 전달받을 것들을 담음

  if (password !== confirm) {
    // 비밀번호와 비밀번호확인이 일치 하지 않을때
    res.status(412).json({ errorMessage: "패스워드가 일치하지 않습니다." });
    return; // 실행되지 않고 코드를 끝내기 위해 return을 함
  }
  // 데이터베이스에 존재하는 닉네임을 입력한 채 회원가입 버튼을 누른 경우
  const isExistUser = await userSchema.findOne({
    $or: [{ nickname }], // or을 이용해 닉네임이 일치할 때, 조회한다.
  });
  if (isExistUser) {
    // 만약 닉네임이 중복된다면
    res.status(412).json({ errorMessage: "중복된 닉네임입니다." });
    return;
  }

  const user = new userSchema({ nickname, password, confirm });
  await user.save(); // DB에 저장

  return res.status(201).json({ message: "회원 가입에 성공하였습니다." });
});

module.exports = router;
