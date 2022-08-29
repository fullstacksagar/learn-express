const mongoose = require("mongoose");
const { Schema } = mongoose;

const productsSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name is Required"],
  },
  description: {
    type: String,
    required: [true, "Description is Required"],
  },
  image: {
    type: String,
    required: [true, "Image is Required"],
  },
  attributes: [
    {
      qty: { type: String, required: [true, "Image is Required"] },
      price: { type: String, required: [true, "Image is Required"] },
      slug: { type: String, required: [true, "Image is Required"] },
    },
  ],
  created: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const product = mongoose.model("product", productsSchema);
// product.createIndexes();
module.exports = product;
