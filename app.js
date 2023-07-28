// app.js

const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cookieParser());
app.use("/api");
app.delete("/item/:Option_id", async (req, res) => {
  try {
    const { Option_id } = req.params;
    const amount = req.query.amount === "true";
    const response = await yourServiceInstance.deleteItem({ Option_id, amount });
    return res.status(response.code).json(response.data);
  } catch (error) {
    return res.status(error.code || 500).json(error.data || "Internal Server Error");
  }
});

app.listen(PORT, () => {
  console.log(PORT, "포트 번호로 서버가 실행되었습니다.");
});
