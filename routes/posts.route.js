// routes/posts.route.js

const express = require("express");
const { Posts } = require("../models");
const router = express.Router();
const authMiddleware = require("../middlewares/auth-middleware");
const { Op } = require("sequelize");
// 게시글 작성 API
router.post("/posts", authMiddleware, async (req, res) => {
  const { userId, nickname } = res.locals.user;
  const { title, content } = req.body;
  const post = await Posts.create({
    UserId: userId,
    title,
    content,
    nickname,
  });
  if (!userId) return res.status(400).json({ errorMassage: "게시글 작성에 실패했습니다." });
  return res.status(201).json({ data: { post } });
});

// 게시글 목록 조회 API
router.get("/posts", async (req, res) => {
  const posts = await Posts.findAll({
    attributes: ["postId", "UserId", "title", "createdAt", "updatedAt", "nickname", "content"],
    order: [["createdAt", "DESC"]], // 내림차순으로 조회
  });
  //   console.log(posts);
  if (!posts) return res.status(400).json({ errorMassage: "게시글 조회에 실패하였습니다." });
  return res.status(200).json({ data: posts });
});

// 게시글 상세 조회 API
router.get("/posts/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Posts.findOne({
      where: { postId },
      attributes: ["postId", "userId", "nickname", "title", "content", "createdAt", "updatedAt"],
    });
    return res.status(200).json({ data: post });
  } catch (err) {
    res.status(400).json({ errorMessage: "게시글 조회에 실패하였습니다." });
  }
});

// 게시글 수정 API
router.put("/posts/:postId", authMiddleware, async (req, res) => {
  try {
    const { postId } = req.params;
    const user = res.locals.user;
    const { title, content } = req.body;
    console.log(user);
    const post = await Posts.findOne({
      where: { postId: postId },
    });
    if (!post) return res.status(403).json({ errorMassage: "게시글이 존재하지 않습니다." });
    if (!title) return res.status(412).json({ errorMassage: "게시글 제목 형식이 일치하지 않습니다." });
    if (!content) return res.status(412).json({ errorMassage: "게시글 내용이 일치하지 않습니다." });
    if (!user) return res.status(403).json({ errorMassage: " 로그인이 필요한 기능입니다." });

    // 게시글을 수정하는 단계
    await Posts.update(
      { title, content }, // 수정할 컬럼 및 데이터
      {
        where: {
          // 어떤 데이터를 수정할 지 작성
          [Op.and]: [{ postId }, { UserId: user.userId }], // 게시글의 아이디와  postId가 일치 할때 수정한다.
        },
      }
    );
    return res.status(200).json({ message: "게시글을 수정하였습니다." });
  } catch (err) {
    console.log(err);
    res.status(400).json({ errorMassage: "게시글 수정에 실패하였습니다." });
  }
});

// 게시글 삭제 API
router.delete("/posts/:postId", authMiddleware, async (req, res) => {
  try {
    const { postId } = req.params;
    const { title, content } = req.body;
    const user = res.locals.user;

    const post = await Posts.findOne({
      where: { postId: postId },
    });
    if (!post) return res.status(403).json({ errorMassage: "게시글이 존재하지 않습니다." });
    if (!title) return res.status(412).json({ errorMassage: "게시글 제목 형식이 일치하지 않습니다." });
    if (!content) return res.status(412).json({ errorMassage: "게시글 내용이 일치하지 않습니다." });
    if (!user) return res.status(403).json({ errorMassage: " 로그인이 필요한 기능입니다." });

    // 게시글을 삭제하는 단계
    await Posts.destroy({
      where: {
        // 어떤 데이터를 수정할 지 작성
        [Op.and]: [{ postId }, { UserId: user.userId }], // 게시글의 아이디와 postId가 일치할 때, 삭제한다.
      },
    });
    return res.status(200).json({ message: "게시글을 삭제하였습니다." });
  } catch (err) {
    console.log(err);
    res.status(400).json({ errorMassage: "게시글 삭제에 실패하였습니다." });
  }
});

module.exports = router;
