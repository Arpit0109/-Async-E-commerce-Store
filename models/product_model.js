

const mongoose = require('mongoose');


const productScehma = mongoose.Schema({
  image: Buffer,
  name: String,
  price: String,
  discount: {
    type: Number,
    default: 0,
  },

  bgcolor: String,
  panelcolor: String,
  textcolor: String,
  type:String,
  date:{
    type:Date,
    default:Date.now
  }
});

module.exports = mongoose.model("product", productScehma);
