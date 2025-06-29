const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middelwares/isLoggedin");
let productModel = require("../models/product_model");
let userModel = require("../models/user_model");
const Fuse = require("fuse.js");
const { disconnect } = require("mongoose");
router.get("/", (req, res) => {
  let error = req.flash("error");
  res.render("index", { error });
});

router.get("/shop", isLoggedIn, async (req, res) => {
  let products = await productModel.find();
  let productName = req.query.sortby;
  let success = req.flash("success");
  res.render("shop", { products, success, selected: productName });
});

router.get("/sortedProduct", isLoggedIn, async (req, res) => {
  let productName = req.query.sortby;
  if (productName == "all") {
    let products = await productModel.find();
    let success = req.flash("success");
    res.render("shop", { products, success, selected: productName });
  } else {
    let products = await productModel.find({ type: productName });
    let success = req.flash("success");
    res.render("shop", { products, success, selected: productName });
  }
});
router.get("/addtocart/:productid", isLoggedIn, async (req, res) => {
  let user = await userModel.findOne({ email: req.user.email });
  // let user = req.user;
  user.cart.push(req.params.productid);
  await user.save();
  req.flash("success", "Added to cart");
  res.redirect("/shop");
});

router.get("/cart", isLoggedIn, async (req, res) => {
  let user = await userModel
    .findOne({ email: req.user.email })
    .populate("cart");

  res.render("cart", { user });
});

router.get("/logout", isLoggedIn, (req, res) => {
  res.render("index");
});
router.get("/searchProduct", isLoggedIn, async (req, res) => {
  const name = req.query.name || "";
  const productName = req.query.sortby;
  const success = req.flash("success");

  const allProducts = await productModel.find();
  const options = {
    keys: [
      { name: "name", weight: 0.6 },
      { name: "type", weight: 0.5 },
      { name: "discription", weight: 0.5 },
    ],
    // keys: ["name", "type", "discription"],
    threshold: 0.5,
    distance: 200,
    minMatchCharLength: 2,
  };

  const fuse = new Fuse(allProducts, options);
  const results = fuse.search(name);

  const matchedProducts = results.map((result) => result.item);

  res.render("shop", {
    products: matchedProducts,
    success,
    selected: productName,
  });
});

router.get("/NewCollection", isLoggedIn, async (req, res) => {
  const allProducts = await productModel.find();
  const success = req.flash("success");
  const productName = req.query.sortby;

  const revProduct = allProducts.reverse();

  res.render("shop", {
    products: revProduct,
    success,
    selected: productName,
  });
});

router.get("/discoutedProduct", isLoggedIn, async (req, res) => {
  try {
    const DiscountedProducts = await productModel.find({
      discount: { $gt: 0 },
    });
    const success = req.flash("success");
    const productName = req.query.sortby;
    res.render("shop", {
      products: DiscountedProducts,
      success,
      selected: productName,
    });
  } catch (err) {
    res.redirect("/shop");
  }
});

router.get("/selectDiscount", isLoggedIn, async (req, res) => {
  const productName = req.query.sortby;
  const DiscountedProducts = await productModel.find({
    $and: [
      { discount: { $gte: productName - 1 } },
      { discount: { $lte: productName * 2 } },
    ],
  });
  const success = req.flash("success");
  res.render("shop", {
    products: DiscountedProducts,
    success,
    selected: productName,
  });
});

router.get("/ProductDettails/:id", isLoggedIn, async (req, res) => {
  const productName = req.query.sortby;
  const product = await productModel.findOne({ _id: req.params.id });

  res.render("ProductDettails", { product, selected: productName });
});

router.get("/remove/:productId", isLoggedIn, async (req, res) => {
  let user = await userModel.findOne({ email: req.user.email });

  user.cart = user.cart.filter(
    (item) => item.toString() !== req.params.productId
  );
  await user.save();
  res.redirect("/cart");
});

module.exports = router;
