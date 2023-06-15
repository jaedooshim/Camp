const mongoose = require("mongoose");
// 게시글 작성
const postSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now, // 기본값은 현재 날짜로 지정
  },
});
module.exports = mongoose.model("Post", postSchema);
