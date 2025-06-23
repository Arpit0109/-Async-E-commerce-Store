const express = require("express");

const router = express.Router();
const upload = require("../config/multer-config");

const productModel = require("../models/product_model");

router.post("/create", upload.single("image"), async (req, res) => {
  try {
    let { name, price, discount, bgcolor, panelcolor, textcolor,type } = req.body;
    let product = await productModel.create({
      image: req.file.buffer,
      name,
      price,
      discount,
      bgcolor,
      panelcolor,
      textcolor,
      type,
    });
    req.flash("success", "Product created successfully");
    res.redirect("/owners/admin");
  } catch (err) {
    // req.flash("success", "something went wrong");
    // res.redirect("/owners/admin");
    res.send(err.message);
  }
});

module.exports = router;
