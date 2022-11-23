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

app.listen(process.env.PORT || port, host, function () {
  console.log(`Server listens http://${host}:${port}`);
});

module.exports = app;