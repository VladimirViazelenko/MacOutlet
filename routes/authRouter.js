const express = require("express");
const authRouter = express.Router();
const userController = require("../controllers/userController")
const bodyParser = require('body-parser');
//const verifyToken = require('../middleware/auth')
//const path = require('path')
//const auth = require("../middleware/auth");

const urlencodedParser = bodyParser.urlencoded({ extended: false });

authRouter.get("/register", function (req, res) {
  res.sendFile('register.html', {root: 'public'});
});
  
authRouter.get("/login", function (req, res) {
  res.sendFile('login.html', {root: 'public'});
});

authRouter.post("/register", urlencodedParser, userController.register)
authRouter.post("/login", urlencodedParser, userController.login)

module.exports = authRouter;
