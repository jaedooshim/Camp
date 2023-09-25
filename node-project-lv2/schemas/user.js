const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  nickname: {
    // nickname 필드
    type: String,
    required: true,
    unique: true,
  },
  password: {
    // password 필드
    type: String,
    required: true,
  },
  confirm: {
    // confirm 필드 (비밀번호 재확인)
    type: String,
    require: true,
  },
});

// 가상의 userId 값을 할당
UserSchema.virtual("userId").get(function () {
  return this._id.toHexString();
});

// nickname 정보를 JSON으로 형변환 할 때 virtual 값이 출력되도록 설정
UserSchema.set("toJSON", {
  virtuals: true,
});

module.exports = mongoose.model("User", UserSchema);
