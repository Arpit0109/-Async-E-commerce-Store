

const mongoose = require('mongoose');

const ownerSchema = mongoose.Schema({

  fullname:String,
  email:String,
  password:String,
  product:{
    type:Array,
    default:[]
  },
  picture: String,
  gstn:String,
});


module.exports = mongoose.model("owner",ownerSchema);