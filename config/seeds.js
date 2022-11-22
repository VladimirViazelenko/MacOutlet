const mongodb = require("mongodb").MongoClient;
const csvtojson = require("csvtojson");
let url = "mongodb+srv://volodymyr95:N7HaNZ2W130zwq6h@cluster0.hyuxkra.mongodb.net/?retryWrites=true&w=majority";

csvtojson()
  .fromFile("device.csv")
  .then(csvData => {
    console.log(csvData);

    mongodb.connect(
      url,
      { useNewUrlParser: true, useUnifiedTopology: true },
      (err, client) => {
        if (err) throw err;

        client
          .db("test")
          .collection("products")
          .insertMany(csvData, (err, res) => {
            if (err) throw err;

            console.log(`Inserted: ${res.insertedCount} rows`);
            client.close();
          });
      }
    );
  });






  
  /* const mongoose = require("mongoose");
const Product = require('../models/product');
const csvtojson = require("csvtojson");

exports.connect = () => {
    mongoose
    .connect("mongodb+srv://volodymyr95:N7HaNZ2W130zwq6h@cluster0.hyuxkra.mongodb.net/?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true })
    .then((_) => console.log("Connected to DB"))
    .catch((err) => console.error("error", err));
};

const csvData = () => {
  
}
const seedDB = async () => {
    await Product.insertMany();
}
seedDB().then(() => {
    mongoose.connection.close()
}) */