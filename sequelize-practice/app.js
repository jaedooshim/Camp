const express = require("express");
const { sequelize, User, Post, Comment } = require("./models");
const user = require("./models/user");

const app = express();

app.use(express.json());

// test API
app.get("/helloWorld", (req, res) => {
  res.json({ message: "hello world!" });
});

// create users
app.post("/users", async (req, res) => {
  try {
    const userInfo = req.body;
    const createdUser = await User.create(userInfo);
    res.json({ createdUser });
  } catch (error) {
    res.json({ message: "error.message" });
  }
});

// create posts
app.post("/posts", async (req, res) => {
  const postInfo = req.body;
  try {
    const createdPost = await Post.create(postInfo);
    res.json({ createdPost });
  } catch (error) {
    res.json({ message: "error.message" });
  }
});

// get posts by userId
app.get("/posts", async (req, res) => {
  const { userId } = req.params; // 1

  try {
    const posts = await Post.findAll({
      include: [{ model: User, as: "user" }],
    });
    res.json({ posts });
  } catch (error) {}
});

app.listen(3000, async () => {
  console.log("server started!");
  await sequelize.authenticate();
  console.log("db authenticated!");
});
