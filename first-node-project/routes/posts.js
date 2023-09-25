const express = require("express");
const router = express.Router();
const readCheck = require("../schemas/post.js"); // 게시글 조회 스키마
const Posts = require("../schemas/post.js"); //  게시글조회에 필요한 스키마를 post.js에서 가져옴
const Post = require("../schemas/post.js");

// 전체 게시글 목록 조회 API   O
router.get("/posts", async (req, res) => {
  const data = await Posts.find({}).sort({ createdAt: -1 });
  // sort를 이용하며 -1 이 내림차순, 1 이 오름차순 => 내림차순으로 하기위해 -1로 함
  // 웹사이트에선 내림차순 적용완료 but DB에는 적용안됨 왜?

  res.status(200).json({ data }); // 데이터를 잘 받아오면 성공(200)으로 호출
});

// 댓글 작성 API O
const Comment = require("../schemas/comment.js");
router.post("/comments/:_postId", async (req, res) => {
  const postId = req.params._postId;
  const { user, content, password } = req.body;

  const existsComment = await Comment.create({
    user,
    content,
    password,
    postId,
  });
  if (existsComment.length) {
    return res
      .status(200)
      .json({ success: true, Message: "댓글을 생성하였습니다." });
  }
  res.json({ existsComment });
});

// 댓글 수정 API O
router.put("/comments/:_commentId", async (req, res) => {
  const { password, content } = req.body;
  const newContent = await Comment.find({ password }); // password를 찾기전 까지 기다린다.
  if (newContent.length) {
    await Comment.updateOne(
      { password: password }, // password에 해당 하는 값이 있으면
      { $set: { content: content } }
    ); // 하나의 컨텐츠를 바꾸면 updateOne 을 사용하고 전체가 아닌 $set을 이용해 하나만 바꾼다.
  }
  res.status(200).json({ success: true, message: "댓글을 수정하였습니다." });
});

// 댓글 삭제 API O
router.delete("/comments/:_commentId", async (req, res) => {
  const { password } = req.body;

  const newContent = await Comment.find({ password });
  if (newContent.length) {
    await Comment.deleteOne({ password });
  }
  res.json({ message: "댓글을 삭제하였습니다." });
});

// 게시글 작성 API O
// 오류가 났는데 전에 유니크 값을 뺐는데 DB에서 인식을 못해 오류가 났었음 ---> // 컬렉션 드랍을 통해 해결
router.post("/posts", async (req, res) => {
  const { content, name, title, password, createdAt } = req.body;

  const createdPost = await Post.create({
    content,
    name,
    title,
    password,
    createdAt,
  }); // await 동기적 처리
  res.json({ createdPost });
});

// 게시글 조회 API O
router.get("/posts", async (req, res) => {
  const postCheck = await Post.find({});
  res.json({ postCheck });
});

// 게시글 수정 API O
router.put("/posts/:_postId", async (req, res) => {
  const { content, name, title, passWord } = req.body;
  const existPost = await Post.find({ name });
  if (existPost.length) {
    await Post.updateOne({ name: name }, { $set: { content: content } });
    // name에 해당하는 값이 있으면 set을 이용해 수정한다 content의 값으로
  }
  res.status(200).json({ success: true, Message: "게시글을 수정하였습니다." });
});

// 게시글 삭제 API O
router.delete("/posts/:_postId", async (req, res) => {
  const { name } = req.body;

  const existPost = await Post.find({ name });
  if (existPost.length) {
    await Post.deleteOne({ name });
  }
  res.json({ message: "게시글을 삭제하였습니다." });
});

module.exports = router;
