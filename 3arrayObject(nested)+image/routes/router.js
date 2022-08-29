const express = require("express");
const bodyParser = require("body-parser");
const router = new express.Router();
const Product = require("../models/products");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: true });

//get all products
router.get("/", (req, res) => {
  Product.find()
    .sort("-_id")
    .exec((err, products) => {
      if (err) {
        res.json({ message: err.message, type: "danger" });
      } else {
        res.render("index", {
          title: "Dashboard",
          page_name: "products",
          products: products,
        });
      }
    });
});

//  image upload
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
  },
});
const upload = multer({ storage: storage }).single("image");

//add product
router.post("/add", upload, urlencodedParser, async (req, res, next) => {
  var qtyarr = req.body.qty;
  var pricearr = req.body.price;
  var slugarr = req.body.slug;
  var attr = [];
  qtyarr.forEach((qty, index, val) => {
    const price = pricearr[index];
    const slug = slugarr[index];
    // console.log(qty, price, slug);
    attr.push({ qty: qty, price: price, slug: slug,colors:[{color:"red"}] });
  });

  const product = new Product({
    name: req.body.name,
    description: req.body.description,
    image: req.file.filename,
    attributes: attr,
  });
  // console.log(product);
  await product.save((err) => {
    if (err) {
      res.json({ message: err.message, type: "error" });
    } else {
      req.session.message = {
        type: "success",
        message: "product Added Successfully !",
      };
      res.redirect("/");
    }
  });
});

//get products
router.get("/add", (req, res, next) => {
  res.render("add", { title: "Add product", page_name: "addproduct" });
});

//edit product
router.get("/edit/:id", (req, res) => {
  let id = req.params.id;
  Product.findById(id, (err, product) => {
    if (err) {
      res.redirect("/");
    } else {
      if (product == null) {
        res.redirect("/");
      } else {
        res.render("edit", {
          title: "Edit product",
          product: product,
          page_name: "editproduct",
        });
      }
    }
  });
});

//update product {POST}
router.post("/update/:id", upload, urlencodedParser, async (req, res, next) => {
  let id = req.params.id;
  let new_image = "";

  if (req.file) {
    new_image = req.file.filename;
    try {
      fs.unlink(
        path.join("./", "uploads", req.body.old_image),
        function (response) {
          // handle the callback
        }
      );
    } catch (error) {
      console.log(error);
    }
  } else {
    new_image = req.body.old_image;
  }
  var qtyarr = req.body.qty;
  var pricearr = req.body.price;
  var slugarr = req.body.slug;
  var attr = [];
  qtyarr.forEach((qty, index, val) => {
    const price = pricearr[index];
    const slug = slugarr[index];
    // console.log(qty, price, slug);
    attr.push({ qty: qty, price: price, slug: slug });
  });
  const product = Product.findByIdAndUpdate(
    id,
    {
      name: req.body.name,
      description: req.body.description,
      image: new_image,
      attributes: attr,
    },
    (err, result) => {
      if (err) {
        res.json({ message: err.message, type: "danger" });
      } else {
        req.session.message = {
          type: "success",
          message: "Product Edit Successfully !",
        };
        res.redirect("/");
      }
    }
  );
});

// delete attribute
router.get("/delete/:productid/:attrid", async (req, res, next) => {
  let productid = req.params.productid;
  let attrid = req.params.attrid;

  await Product.findByIdAndUpdate(
    { _id: productid },
    {
      $pull: {
        attributes: {
          _id: attrid,
        },
      },
    }
  );
  req.session.message = {
    type: "success",
    message: "Attribute Deleted  !",
  };
  res.redirect("/edit/" + productid);
});

// delete product
router.get("/delete/:id", async (req, res) => {
  let id = req.params.id;

  Product.findByIdAndRemove(id, (err, result) => {
    if (err) {
      res.json({ message: err.message, type: "danger" });
    } else {
      if (result.image != "") {
        try {
          fs.unlinkSync("./uploads/" + result.image);
          req.session.message = {
            type: "success",
            message: "product Deleted  !",
          };
          res.redirect("/");
        } catch (error) {
          console.log(error);
        }
      }
    }
  });
});
module.exports = router;
