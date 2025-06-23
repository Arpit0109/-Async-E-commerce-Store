const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middelwares/isLoggedin");
let productModel = require("../models/product_model");
let userModel = require("../models/user_model");
const Fuse = require("fuse.js");
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
    keys: ["name"],
    threshold: 0.4,
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

router.get("/NewCollection",isLoggedIn, async (req, res) => {
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

router.get("/discoutedProduct",isLoggedIn, async (req, res) => {
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



module.exports = router;
