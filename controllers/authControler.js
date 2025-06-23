const productModel = require("../models/product_model");
const userModel = require("../models/user_model");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const genratetoken = require("../utils/genratetoken");
const e = require("express");

const registerUser = async (req, res) => {
  try {
    let { fullname, email, password } = req.body;

    let exiestingUser = await userModel.findOne({ email });
    if (exiestingUser) {
      req.flash("error", "User already exists");
      res.redirect("/");
      // res.status(401).send("user already exiests");
    } else {
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, async (err, hash) => {
          if (err) {
            res.send(err.message);
          } else {
            let user = await userModel.create({
              fullname,
              email,
              password: hash,
            });
            let token = genratetoken(user);
            res.cookie("token", token);
            // res.send("user created sucessfully");
            // req.flash("error", "User created sucessfull");
            res.redirect("/");
          }
        });
      });
    }
  } catch (err) {
    console.log(err.message);
  }
};

const loginUser = async (req, res) => {
  try {
    let { email, password } = req.body;
    let user = await userModel.findOne({ email });
    if (!user) {
      req.flash("error", "User Not exists");
      return res.redirect("/");
      // res.status(401).send("user not found");
    } else {
      bcrypt.compare(password, user.password, async (err, result) => {
        if (result) {
          let token = genratetoken(user);
          res.cookie("token", token);
          // let products = await productModel.find();
          // res.render("shop",{products});
          res.redirect("/shop");
        } else {
          req.flash("error", "something went wrong");
          res.redirect("/");
          // res.status(401).render("password is not correct");
        }
      });
    }
  } catch (err) {
    console.log(err.message);
  }
};

const logout = (req, res) => {
  res.cookie("token", "");
  res.redirect("/");
};
module.exports = { registerUser, loginUser, logout };
