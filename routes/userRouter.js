const express = require("express");
const userRouter = express.Router();
const userController = require("../controllers/userController")
//const verifyToken = require("../middleware/auth");

userRouter.use(express.static('public'));

userRouter.get("/main", function (req, res) {
    res.sendFile('index.html', {root: 'public'});
    });

userRouter.get("/users", userController.users)
userRouter.get("/products", userController.products)

module.exports = userRouter;