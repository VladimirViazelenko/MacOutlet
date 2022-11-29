const mongoose = require("mongoose");

exports.connect = () => {
    mongoose
    .connect("mongodb+srv://volodymyr95:N7HaNZ2W130zwq6h@cluster0.hyuxkra.mongodb.net/?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true })
    .then((_) => console.log("Connected to DB"))
    .catch((err) => console.error("error", err));
};

