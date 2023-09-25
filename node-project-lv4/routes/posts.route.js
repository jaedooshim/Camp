// routes/posts.route.js

const express = require("express");
const { Posts, Likes } = require("../models");
const { Sequelize } = require("sequelize"); // sequelize 모델 사용
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

// 게시글 목록 조회 API  1번째로 했을때 좋아요 COUNT가 되질 않았음.
// router.get("/posts", async (req, res) => {
//   try {
//     const posts = await Posts.findAll({
//       attributes: ["postId", "UserId", "title", "createdAt", "updatedAt", "nickname", "content"],
//       include: [
//         {
//           model: Likes,
//           attributes: ["likeId"],
//         },
//       ],
//       order: [["createdAt", "DESC"]],
//     });
//     //   console.log(posts);
//     if (!posts) return res.status(400).json({ errorMassage: "게시글 조회에 실패하였습니다." });
//     return res.status(200).json({ data: posts });
//   } catch (err) {
//     console.log(err.message);
//   }
// });

// 게시글 목록 조회 API 2번째 COUNT 표시 코드
router.get("/posts", async (req, res) => {
  try {
    const posts = await Posts.findAll({
      // Posts모델에서 모든게시글을 찾고 아래 속성들을 API응답에 포함시킴
      attributes: [
        "postId",
        "UserId",
        "title",
        "createdAt",
        "updatedAt",
        "nickname",
        "content",
        // 1. 5번째줄 Sequelize 라이브러리를 호출한다.
        // 2. Sequelize의 COUNT함수를 사용하여 Likes모델의 likeId를 받고 뒤의 likesCount로 저장한다.
        [Sequelize.fn("COUNT", Sequelize.col("Likes.likeId")), "likesCount"],
      ],
      include: [
        {
          // Likes모델을 참조하여 속성에 좋아요를한 likeId를 반환
          model: Likes,
          attributes: ["likeId"], // likeId 없이 빈 배열[] 이면 likeId를 카운트한것을 반환
        },
      ],
      order: [["createdAt", "DESC"]], // createdAt(생성날짜)기준으로 내림차순정렬(DESC)
      group: ["Posts.postId"], // group을 통해 게시물ID별로 그룹화
    });

    if (!posts) return res.status(400).json({ errorMassage: "게시글 조회에 실패하였습니다." });
    return res.status(200).json({ data: posts });
  } catch (err) {
    console.log(err.message);
  }
});

// 게시글 상세 조회 API
router.get("/posts/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Posts.findOne({
      where: { postId },
      attributes: ["postId", "userId", "nickname", "title", "content", "createdAt", "updatedAt"],
      include: [
        {
          model: Likes,
          attributes: ["likeId", "userId"],
        },
      ],
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
