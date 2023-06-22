const express = require("express");
const Comment = require("../schemas/comment.js");
const router = express.Router();
const readCheck = require("../schemas/post.js"); // 게시글 조회 스키마
const Posts = require("../schemas/post.js"); //  게시글조회에 필요한 스키마를 post.js에서 가져옴
const Post = require("../schemas/post.js");
const authMiddleware = require("../middlewares/auth-middleware.js"); // 사용자 인증 미들웨어 생성

// 전체 게시글 목록 조회 API
router.get("/posts", authMiddleware, async (req, res) => {
  try {
    const { userId, nickname } = res.locals.user;

    // sort를 이용하며 -1 이 내림차순, 1 이 오름차순 => 내림차순으로 하기위해 -1로 함
    // Posts 컬렉션에서 userId와 일치하는것을 찾고 결과반환을 위해await로 비동기적 실행
    const posts = await Posts.find({ userId }).sort({ createdAt: -1 });

    const result = posts.map((data) => {
      // map을 통해 배열들을 돌면서 새로운 배열들을 result에 담는다
      return {
        postId: data._id,
        userId: data.userId,
        nickname: nickname,
        title: data.title,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      };
    });
    res.status(200).json({ posts: result }); // 게시글 조회에 성공한 경우 result안 객체를 조회
  } catch (err) {
    res.status(400).json({
      // 400예외 케이스에서 처리하지 못한 에러
      errorMessage: "게시글 조회에 실패하였습니다.",
    });
  }
});

// 게시글 상세조회 API
router.get("/posts/:postId", async (req, res) => {
  try {
    const { _postId } = req.params;
    const detailpost = await Posts.findOne({ _id: _postId }); // Posts컬렉션에서 findOne을 통해 _id필드와 _postId가 일치하는것을 찾음
    res.status(200).json({
      // 성공시 프로퍼티안의 코드들을 응답
      post: {
        postId: detailpost.postId,
        userId: detailpost.userId,
        nickname: detailpost.nickname,
        title: detailpost.title,
        content: detailpost.content,
        createdAt: detailpost.createdAt,
        updatedAt: detailpost.updatedAt,
      },
    });
  } catch (err) {
    res.status(400).json({ errorMessage: "게시글 조회에 실패하였습니다." });
  }
});

// 게시글 작성 API
router.post("/posts", authMiddleware, async (req, res) => {
  // 사용자인증 미들웨어를 담은 변수 authMiddleware를 async 앞에 놓는다.
  const { userId } = res.locals.user;
  console.log(userId);
  const { content, title } = req.body;
  const Nickname = res.locals.userNickname;
  // 에러핸들링
  try {
    if (!req.body) return res.status(412).json({ errorMessage: "데이터형식이 올바르지 않습니다." }); // 요청한 body값이 없으면
    if (!title) return res.status(412).json({ errorMessage: "게시글 제목의 형식이 일치하지 않습니다." }); // title값이 없으면
    if (!content) return res.status(412).json({ errorMessage: "게시글 내용의 형식이 일치하지 않습니다." }); // content값이 없으면
    await Post.create({ userId: userId, nickname: Nickname, content, title }); // 비동기 -> Post미들웨어를 통해 객체안의 값들을 create 생성
    res.status(201).json({ Message: " 게시글 작성 성공" });

    // # 403 Cookie가 비정상적이거나 만료된 경우 ??
  } catch (err) {
    return res.status(400).json({ errorMessage: "게시글 작성에 실패하였습니다." });
  }
});

// 게시글 수정 API
router.put("/posts/:postId", authMiddleware, async (req, res) => {
  const { userId } = res.locals.user;
  const { postId } = req.params; //params에서 postId 가져옴
  const { title, content } = req.body; // title,content => 수정할 내용
  const post = await Posts.findOne({ _id: postId });
  // 에러핸들링
  try {
    if (!body.data) return res.status(412).json({ errorMessage: "데이터 형식이 올바르지 않습니다." }); // body.data가 없으면 412반응
    else if (typeof title !== "string") return res.status(412).json({ errorMessage: "게시글 제목의 형식이 일치하지 않습니다." }); // title의 타입이 string이 아닐때
    else if (typeof content !== "string") return res.status(412).json({ errorMessage: "게시글 내용의 형식이 일치하지 않습니다." }); // content의 타입이 string이 아닐때
    else if (userId !== post.userId) return res.status(412).json({ errorMessage: "게시글 수정권한이 없습니다." }); // 유저ID와 post유저ID가 다를때

    await Posts.updateOne(
      { userId, _id: postId }, // userId 와 postId가 일치했을때
      {
        $set: {
          // set은 몽고DB에서 수정을 할때 쓰는 연산자로  title과 content를 수정하고자 한다.
          title: title,
          content: content,
        },
      }
    );

    res.json({ message: "게시글을 수정하였습니다." }); // 수정한 경우
  } catch (error) {
    // 400 예외 케이스에서 처리하지 못한 에러
    return res.status(400).json({ errorMessage: "게시글 수정에 실패하였습니다." });
  }
});

// 게시글 삭제 API
router.delete("/posts/:postId", authMiddleware, async (req, res) => {
  const { userId } = res.locals.user;
  const { postId } = req.params; //params에서 postId 가져옴

  const postDelete = await Posts.findOne({ _id: postId });
  // 에러핸들링
  try {
    if (!postDelete) return res.status(404).json({ errorMessage: "게시글이 존재하지 않습니다." }); // 117번줄 변수에 담은 Id값이 없다면
    else if (!postId || !userId) return res.status(403).json({ errorMessage: "로그인이 필요한 기능입니다." }); // postId가
    else if (postId !== postDelete.userId) return res.status(403).json({ errorMessage: "게시글 삭제권한이 없습니다." }); // 유저ID와 post유저ID가 다를때

    await Posts.deleteOne({ userId, _id: postId }); // userId 와 postId가 일치했을때 삭제를 한다.
    res.json({ message: "게시글을 삭제하였습니다." }); // 삭제한 경우
  } catch (error) {
    // 400 예외 케이스에서 처리하지 못한 에러
    return res.status(400).json({ errorMessage: "게시글 작성에 실패하였습니다." });
  }
});

module.exports = router;
