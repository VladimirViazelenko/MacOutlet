const express = require("express");
const userRouter = express.Router();
const {userController} = require("../controllers/userController")
const bodyParser = require('body-parser');
const verifyToken = require("../middleware/auth");
const urlencodedParser = bodyParser.urlencoded({ extended: false });

const login = process.cwd() + "/app/src/views/login.html";
const register = process.cwd() + "/app/src/views/register.html";
const main = process.cwd() + "/app/src/views/index.html";

userRouter.use(express.json());
userRouter.use("/css", express.static(process.cwd() + "/app/src/public/css"));
userRouter.use("/js", express.static(process.cwd() + "/app/src/public/js"));
userRouter.use("/img", express.static(process.cwd() + "/app/src/public/img"));

userRouter.get("/register", function (req, res) {
  res.sendFile(register);
});
  
userRouter.get("/login", function (req, res) {
  res.sendFile(login);
});

userRouter.get("/main", function (req, res) {
  res.sendFile(main);
});

userRouter.get("/products", verifyToken, userController.products)

userRouter.post("/register", urlencodedParser, userController.register)
userRouter.post("/login", urlencodedParser, userController.login)

module.exports = userRouter;
