const express = require("express");

const router = express.Router();

const ownerModel = require("../models/owner_model");
let productModel = require("../models/product_model");
const upload = require("../config/multer-config");

// console.log(process.env.NODE_ENV);

if (process.env.NODE_ENV === "development") {
  router.post("/create", async (req, res) => {
    let owner = await ownerModel.find();
    if (owner.length > 0) {
      return res
        .status(504)
        .send("You dont have permision to create a new owner");
    } else {
      let { fullname, email, password } = req.body;
      let createdOwner = await ownerModel.create({
        fullname,
        email,
        password,
      });
      res.status(201).send(createdOwner);
    }
  });
}
// router.get("/", (req, res) => {
//   res.send("HYYY its working");
// });

router.get("/admin", (req, res) => {
  let success = req.flash("success");
  res.render("createproducts", { success });
});

router.get("/UpdatePage", async (req, res) => {
  const allProducts = await productModel.find();

  res.render("UpdatePage", {
    products: allProducts,
  });
});

router.get("/UpdateProduct/:productid", async (req, res) => {
  const product = await productModel.findOne({ _id: req.params.productid });

  res.render("UpdateProduct", { product });
});

router.post(
  "/UpdateProduct/:productid",
  upload.single("image"),
  async (req, res) => {
    const {
      name,
      price,
      discount,
      bgcolor,
      panelcolor,
      textcolor,
      type,
      discription,
    } = req.body;

    const updateData = {
      name,
      price,
      discount,
      bgcolor,
      panelcolor,
      textcolor,
      type,
      discription,
    };
    if (req.file) {
      updateData.image = req.file.buffer;
    }

    const product = await productModel.findOneAndUpdate(
      { _id: req.params.productid },
      updateData
    );

    res.redirect("/owners/UpdatePage");
  }
);

module.exports = router;
