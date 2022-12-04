require("dotenv").config();
require("./config/database").connect();
const express = require("express");
const userRoutes = require("./routes/userRoutes");
const path = require('path');
const cookieParser = require('cookie-parser');

const app = express();
const host = 'localhost';
const port = process.env.PORT || 3000;

app.use(cookieParser());
app.use(express.json());
app.use('/user', userRoutes);
app.use("/css", express.static(process.cwd() + "/client/css"));
app.use("/js", express.static(process.cwd() + "/client/js"));
app.use("/img", express.static(process.cwd() + "/client/img"));

app.get('/', function (req, res) {
  res.sendFile(path.join(process.cwd() + "/client", "/login.html"));
});

app.listen(port, () => {
  console.log(`Server running http://${host}:${port}/ `);
});

module.exports = app;