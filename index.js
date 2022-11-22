require("dotenv").config();
require("./config/database").connect();
const express = require("express");
const authRouter = require("./routes/authRouter");
const userRouter = require("./routes/userRouter")
const app = express();

const host = 'localhost';
const port = 3000;

app.use(express.json());
app.use(express.static('public'))
app.use("/auth", authRouter);
app.use("/user", userRouter);

app.listen(port, () => {
  console.log(`Server running http://${host}:${port}/ `);
});

module.exports = app;