const mongoose = require("mongoose");

// 댓글 작성
const commentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "Post", //ref : 참조하다
  },
  content: {
    type: String,
    require: true,
  },
});

commentSchema.virtual("commentId").get(function () {
  return this._id.toHexString();
});
commentSchema.set("toJSON", {
  virtuals: true,
});

module.exports = mongoose.model("Comment", commentSchema); // Q영규 : Comment ? commentSchema ?
