const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = 3000 || 5000;
const cors = require("cors");
app.use(express.json());
app.use(cors());

//create product schema
const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
//create product model
const Product = mongoose.model("Products", productSchema);
mongoose
  .connect("mongodb://127.0.0.1:27017/testProductDB")
  .then(() => {
    console.log("Db is connected");
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });

//routes
app.get("/", (req, res) => {
  res.send("welcome to server");
});
//get products
app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    // const products = await Product.find().limit(2);
    if (products) {
      res.status(200).send(products);
    } else {
      res.status(404).send({ message: "Products not found" });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});
//get product by specific id
app.get("/products/:id", async (req, res) => {
  const id = req.params.id;
  try {
    //specific property
    // const product = await Product.findOne({ _id: id }).select({
    //   title: 1,
    //   price: 1,
    //   _id: 0,
    // });
    // const product = await Product.findOne({ _id: id }, { title: 1, _id: 0 });
    // const product = await Product.findById(id);
    const product = await Product.findOne({ _id: id });
    if (product) {
      res.status(200).send(product);
    } else {
      res.status(404).send({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});
//create product
app.post("/products", async (req, res) => {
  try {
    const { title, price, description } = req.body;
    const newProduct = new Product({ title, price, description });
    const productData = await newProduct.save();
    res.status(201).send(productData);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});
app.listen(port, () => {
  console.log(`Running at ${port}`);
});
