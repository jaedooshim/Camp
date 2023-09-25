const express = require("express");
const { Likes, Posts } = require("../models"); // include안 모델을 참고하기 위해 선언함
const authMiddleware = require("../middlewares/auth-middleware");

const router = express.Router();
// 게시글 좋아요 API
router.put("/posts/:postId/like", authMiddleware, async (req, res) => {
  try {
    const { userId } = res.locals.user; // 미들웨어 user변수에 담긴것을 전역으로 불러옴
    const { postId } = req.params; // DB에 저장된 postId 가져옴

    const createLike = await Likes.findOne({ where: { UserId: userId, PostId: postId } });
    // Likes모델을 참조해 userId와 postId가 일치하는것을 찾는다
    if (createLike) {
      await createLike.destroy();
      // 일치하는것이 있다면 destroy method를 사용해 카운트 감소
      const likeCount = await Likes.count({ where: { PostId: postId } });
      // Likes모델을 참조해 userId와 postId가 일치한것이 있다면 count를 이용해 취소하게 만듬
      return res.status(200).json({ message: "게시글의 좋아요를 취소하였습니다.", likeCount });
    }

    await Likes.create({ UserId: userId, PostId: postId });
    // Likes모델에서 userId와 postId가 일치할시 create method를 이용해 만든다
    const likeCount = await Likes.count({ where: { PostId: postId } }); // Likes모델을 참조해 userId와 postId가 일치하면 count
    if (!authMiddleware) res.status(403).json({ message: "로그인이 필요한 기능입니다." }); // 미들웨어가 없어 로그인이 안된 경우
    if (!postId) res.status(404).json({ message: "게시글이 존재하지 않습니다." }); // postId가 존재하지 않는 경우
    res.status(200).json({ message: "게시글의 좋아요를 등록하였습니다.", likeCount }); // 성공할때, 그리고 likeCount변수 값을 넣음
  } catch (error) {
    // 예외처리
    console.error(error); // 에러메세지를 보기위해 error를 넣었음
    res.status(400).json({ message: "게시글 좋아요에 실패하였습니다." });
  }
});

// 좋아요 게시글 조회 API
router.get("/like/posts", authMiddleware, async (req, res) => {
  try {
    const { userId } = res.locals.user; // 미들웨어 user 가져옴
    // console.log(userId);
    const likes = await Likes.findAll({
      // Likes모델에서 userId가 일치하는것읇 찾고
      where: { UserId: userId },
      attributes: ["postId", "userId", "likeId"], // 속성에 postId,userId,likeId를 추가
      include: [
        // Posts모델을 참고하여 attributes에 있는 컬럼들을 include를 통해 추가함
        {
          model: Posts,
          attributes: ["title", "content", "nickname", "createdAt", "updatedAt"],
        },
      ],
    });
    // console.log(likes);
    return res.status(200).json(likes); // 성공시 likes 변수에 담은것을 message에 남김
  } catch (error) {
    // 예외처리
    console.log(error); // error 메세지를 볼려고 넣음
    res.status(400).json({ message: "좋아요 게시글 조회에 실패하였습니다." });
  }
});
module.exports = router;
