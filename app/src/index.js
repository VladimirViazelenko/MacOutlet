require("dotenv").config();
require("./config/database").connect();
const express = require("express");
const userRoutes = require("./routes/userRoutes");
const cookieParser = require('cookie-parser');

const app = express();
const host = 'localhost';
const port = process.env.PORT || 3000;

app.use(cookieParser());
app.use(express.json());

app.use('/user', userRoutes);

app.get('/', function (req, res) {
  res.redirect('/user/login');
});

app.listen(port, () => {
  console.log(`Server running http://${host}:${port}/ `);
});

module.exports = app;