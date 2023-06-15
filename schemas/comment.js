const mongoose = require("mongoose");

// 댓글 작성
const commentSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    require: false, // 댓글이 없을수도 있기때문에 false로 설정
  },
  password: {
    type: String,
    require: true,
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post", //ref : 참조하다
  },
});

module.exports = mongoose.model("Comment", commentSchema); // Q영규 : Comment ? commentSchema ?
