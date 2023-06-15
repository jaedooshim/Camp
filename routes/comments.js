const express = require("express");
const router = express.Router();

const Comment = require("../schemas/comment.js");
const Post = require("../schemas/post.js");
// 댓글을 남기기 위해서는 게시글 정보가 필요하다고 생각하여 post 스키마를 가져옴

// 댓글 조회 API O
router.get("/comments/:_postId", async (req, res) => {
  const postId = req.params._postId;
  //[{user, password, content}]
  const comments = await Comment.find({ postId });

  // Comment에 해당하는 모든 정보를 가지고 올건데,
  // 만약 userIds 변수 안에 존재하는 값일 때에만 조회.

  res.json({
    userCmt: comments,
  });
});

module.exports = router;
