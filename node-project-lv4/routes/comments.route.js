const express = require("express");
const { Posts, Comments } = require("../models");
const router = express.Router();
const authMiddleware = require("../middlewares/auth-middleware");
const { Op } = require("sequelize");

// 댓글 생성 API
router.post("/posts/:postId/comments", authMiddleware, async (req, res) => {
  const PostId = req.params.postId; // DB에 저장된 postId를 params를 이용해 불러옴
  const UserId = res.locals.user.userId; // 미들웨어에서 user에 담은 정보를 전역으로 만든뒤 불러옴
  //   console.log(PostId, UserId);
  const { content } = req.body; // body에 content를 입력해 댓글 생성
  //   console.log(content);
  try {
    // content가 없을 경우
    if (!content) return res.status(412).json({ errorMessage: "데이터 형식이 올바르지 않습니다." });
    // content가 있을 경우 객체 안의 값을 생성하고 response을 반환
    await Comments.create({ content, PostId, UserId });
    res.status(201).json({ message: "댓글을 작성하였습니다." });
  } catch (error) {
    // 예외처리
    console.log(error);
    return res.status(400).json({ errorMessage: "댓글 작성에 실패하였습니다." });
  }
});

// 댓글 목록 조회 API
router.get("/posts/:postId/comments", authMiddleware, async (req, res) => {
  try {
    const postId = req.params.postId; // DB에 저장된 postId를 불러옴

    // Comments에 있는 객체안 postId가 일치하는것을 찾으면 comments 변수에 담는다
    const comments = await Comments.findAll({
      where: { postId: postId },
    });

    // data변수에 위의 comments변수에 담긴 일치하는 postId를 map을 이용해 각 코멘트 하나씩 돌며 객체안을 반환
    const data = comments.map((comments) => {
      return {
        commentId: comments.commentId,
        content: comments.content,
        UserId: comments.UserId,
        createdAt: comments.createdAt,
        updatedAt: comments.updatedAt,
      };
    });
    // postId가 없을 경우
    if (!postId) return res.status(404).json({ errorMessage: "게시글이 존재하지 않습니다." });
    // response에 data안에 담긴 객체를 메세지로 반환
    res.status(200).json(data);
    // 에러 예외처리
  } catch (error) {
    return res.status(400).json({ errorMessage: "댓글 조회에 실패하였습니다." });
  }
});

// 댓글 수정 API
router.put("/posts/:postId/comments/:commentId", authMiddleware, async (req, res) => {
  try {
    const { commentId } = req.params; // DB에 저장된 commentId를 params를 이용해 불러옴
    const { content } = req.body; // 수정할 content를 body에 입력한 뒤 수정
    const UserId = res.locals.user.userId; // 미들웨어에서 user에 담은 정보를 전역으로 쓸수 있게 해서 userId를 UserId 변수에 담음

    const comment = await Comments.findOne({ where: { commentId } }); // Comments모델의 commentId가 일치하는것을 조회
    if (comment.UserId !== UserId) return res.status(403).json({ errorMessage: "댓굴 수정권한이 존재하지 않습니다." }); // 코멘드 userId와 UserId가 일치하지않은 경우
    if (!content) return res.status(403).json({ errorMessage: "게시글이 존재하지 않습니다." }); // content가 없을 경우
    await Comments.update({ content }, { where: { commentId } }); // 위의 오류에 걸리는것이 commentId가 일치할시 update method를 이용해 수정

    res.status(200).json({ message: "댓글을 수정하였습니다." }); // res메시지 반환
  } catch (error) {
    // 예외처리
    return res.status(400).json({ errorMessage: "댓글 수정에 실패하였습니다." });
  }
});

// 댓글 삭제 API
router.delete("/posts/:postId/comments/:commentId", authMiddleware, async (req, res) => {
  try {
    const { commentId } = req.params; // DB에 저장된 commentId를 불러옴
    const UserId = res.locals.user.userId; // 미들웨어에서 user에 담은 userId를 전역으로 쓰고 변수에 담음

    const comment = await Comments.findOne({ where: { commentId } }); // Comments모델을 참고하여 일치하는 commentId를 찾고 findOne method를 이용해 찾음
    if (comment.UserId !== UserId) return res.status(403).json({ errorMessage: "댓굴 삭제권한이 존재하지 않습니다." }); // comment.UserId와 UserId가 일치하지 않을때
    if (!UserId) return res.status(403).json({ errorMessage: "게시글이 존재하지 않습니다." }); // UserId가 없을 경우
    await Comments.destroy({ where: { commentId: commentId } }); // 위의 if문에 걸리지 않고 Comments모델의 commentId가 일치할 경우 destroy method를 이용해 삭제
    res.status(200).json({ message: "댓글을 삭제하였습니다." }); // 성공시
  } catch (error) {
    // 예외처리
    return res.status(400).json({ errorMessage: "댓글 삭제에 실패하였습니다." });
  }
});

module.exports = router;
