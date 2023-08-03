// app.js
const express = require("express");
const cookieParser = require("cookie-parser");
const fs = require("fs");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

fs.readdirSync("./routes").forEach((route) => {
  app.use("/api", require(`./routes/${route}`));
});

app.listen(3000, () => {
  console.log(3000, "포트 번호로 서버가 실행되었습니다.");
});
