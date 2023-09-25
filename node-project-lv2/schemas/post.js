const mongoose = require("mongoose");
// 게시글 작성
const postSchema = new mongoose.Schema({
  nickname: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
  },
  content: {
    type: String,
  },
});
postSchema.set("timestamps", true); // 게시글 작성시 작성 순간 객체값들 자동으로 들어감
module.exports = mongoose.model("Post", postSchema);
