const express = require("express");
const router = express.Router();

const Comment = require("../schemas/comment.js");
const Post = require("../schemas/post.js");
const authMiddleware = require("../middlewares/auth-middleware.js");
const comment = require("../schemas/comment.js");
// 댓글을 남기기 위해서는 게시글 정보가 필요하다고 생각하여 post 스키마를 가져옴

// 댓글 생성 API
router.post("/posts/:postId/comments", authMiddleware, async (req, res) => {
  const { userId } = res.locals.user;
  const { postId } = req.params;
  const { comment, nickname } = req.body;

  let createdcomments = await Comment.create({
    // create를 통해 프로퍼티내용들을 생성
    userId,
    comment,
    nickname,
  });
  console.log(createdcomments);
  res.status(201).json({ message: "댓글을 작성하였습니다." }); // 댓글작성 성공시

  const newPost = await Post.findOne({ userId, id: postId }); // Id를 찾고나서 못찾을 경우 아래의 에러메세지 출력
  try {
    if (!newPost) return res.status(404).json({ errorMessage: "게시글이 존재하지 않습니다." });

    if (!comment) return res.status(403).json({ errorMessage: "댓글을 작성해주세요." });
  } catch (err) {
    return res.status(400).json({
      errorMessage: "댓글 작성에 실패했습니다.",
    });
  }
});

// 댓글 목록 조회 API
router.get("/posts/:postId/comments", authMiddleware, async (req, res) => {
  try {
    const { userId } = res.locals.user;
    const { postId } = res.params;
    const comments = await Comment.find({ userId }).sort({ createdAt: -1 });
    const result = comments.map((data) => {
      return {
        commentId: data.id,
        userId: data.userId,
        nickname: data.nickname,
        comment: data.comment,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      };
    });
    res.status(200).json({ comments: result });
    if (!comments) return res.status(404).json({ errorMessage: "게시글이 존재하지 않습니다." });
  } catch (err) {
    return res.status(400).json({ errorMessage: "댓글 조회에 실패하였습니다." });
  }
});

// ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
// 댓글 수정부터 시간이 없는 관계로 다하신분의 코드를 가져왔습니다. 댓글수정 아래의 코드들은 추후 주말이나 시간 여유가 있을때 다시 작성해보며 공부해보겠습니다.

/* 댓글 수정 API */
router.put("/posts/:_postId/comments/:_commentId", authMiddleware, async (req, res) => {
  try {
    const { userId } = res.locals.user;
    const { _commentId } = req.params;
    const { comment } = req.body;

    const existComment = await Comment.find({ userId, _id: _commentId });

    if (!userId) {
      return res.status(403).json({
        errorMessage: "로그인이 필요한 기능입니다.",
      });
    }
    if (comment.length == 0) {
      return res.status(400).json({
        message: "댓글을 입력해주세요",
      });
    }
    if (existComment.length) {
      await Comment.updateOne({ userId, _id: _commentId }, { $set: { comment } });
      return res.status(200).json({
        message: "댓글을 수정하였습니다.",
      });
    } else {
      return res.status(400).json({
        message: "댓글 조회에 실패하였습니다.",
      });
    }
  } catch (err) {
    return res.status(400).json({
      message: "데이터 형식이 올바르지 않습니다.",
    });
  }
});

/* 댓글 삭제 API */
router.delete("/posts/:_postId/comments/:_commentId", authMiddleware, async (req, res) => {
  try {
    const { userId } = res.locals.user;
    const { _commentId } = req.params;

    const commentlist = await Comment.find({ userId, _id: _commentId });

    if (commentlist.length) {
      await Comment.deleteOne({ userId, _id: _commentId });
    } else {
      return res.status(403).json({
        errorMessage: "댓글의 삭제권한이 존재하지 않습니다.",
      });
    }
    res.status(200).json({
      message: "댓글을 삭제하였습니다.",
    });
  } catch (err) {
    // 그 외에 에러들은 에러메세지 반환
    return res.status(400).json({
      message: "댓글 삭제에 실패하였습니다.",
    });
  }
});

module.exports = router;
