


const express = require("express");
const router = express.Router();
const {registerUser,loginUser,logout} = require("../controllers/authControler");
const { isLoggedIn } = require("../middelwares/isLoggedin");

// require("dotenv").config();

router.get("/", (req, res) => {

  let error = req.flash("error");
  res.render("index",{error});
});

router.get("/shop",isLoggedIn, (req, res) => {
  res.render("shop");
});
// router.get("/logout",isLoggedIn, (req, res) => {
//   res.redirect("/");
// });


router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logout);

module.exports = router;
