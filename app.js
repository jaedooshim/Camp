const express = require("express");
const app = express();
const port = 3000; // 3000번 port로 서버연결
app.use(express.json()); // body에 데이터가 들어왔을때 사용할수있도록하는 전역 미들웨어
const PostRouter = require("./routes/posts.js");
const commentRouter = require("./routes/comments.js");
const connect = require("./schemas");
connect();
// 미들웨어는 순차적으로 거쳐서 아래의 app.use("/api", [PostRouter]) 보다 위에 있어야함

app.use("/", [PostRouter, commentRouter]);

app.listen(port, () => {
  console.log(port, "포트로 서버가 열렸어요!");
});
