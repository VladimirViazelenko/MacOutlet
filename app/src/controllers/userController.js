const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const User = require("../models/user");
const Product = require("../models/product");

let token;
let createToken = require('crypto').randomBytes(64).toString('hex');

class userController {
    async register(req, res) {
      try {
        const {username, email, password} = req.body;
      
          if (!(username && email && password)) {
            return res.status(400).send({ error: "All input is required" });
          }
          const oldUsername = await User.findOne({username:username});
          const oldEmail = await User.findOne({email:email});

          if (oldUsername) {
            return res.status(400).send(`User with email ${username} already exist. Please Login`);
          }

          if (oldEmail) {
            return res.status(400).send(`User with username ${email} already exist. Please Login`);
          }
          
          const salt = await bcrypt.genSalt(10);
          const hashPassword = await bcrypt.hash(password, salt);

          const user = new User({ username, email: email.toLowerCase(), password: hashPassword });
          await user.save();
          res.status(200);
          res.redirect('/user/login');
          console.log("User successfully registered. Please login" )
      } catch (err) {
        console.log(err);
        return res.status(400).send("Registration error");
      }
    }
    
    async login(req, res) {
      try {
        const {username, password} = req.body;
        const user = await User.findOne({ username });
        if (!user) {
          res.status(200)
          res.redirect('/user/login');
        } else if (user) {
          const validPassword = await bcrypt.compare(password, user.password);
          if (validPassword) {
            token = jwt.sign(
              { user_id: user._id, 
                username: user.username }, 
                createToken,
              {
                expiresIn: 3600,
              }
            );
            res.status(200)
            res.cookie("token", token);
            res.redirect('/user/main');
            console.log("Valid password. Login successfully completed");
          } else {
            res.status(400).json({ error: "Invalid password. Check password" });
          }
        } 
      } catch (err) {
        console.log(err);
        res.status(400).json("Error login");
      }}
      
      async products(req, res) {
        try {
          const products = await Product.find()
          res.send(products)
        } catch (error) {
            console.log(error)
        }
      } 
  }
  
module.exports = {
  createToken,
  userController: new userController()
}