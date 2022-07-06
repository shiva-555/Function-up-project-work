/***********************************REQUIRE MONGOOSE LIBARARY*********************************/
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    title: {
        type: String,
        required: "Title is Required",
        enum: ["Mr", "Mrs", "Miss"],
      },
    name: {
      type: String,
      required: "Name is Required",
      trim: true,
    },

    phone: {
      type: String,
      required: "Phone number is Required",
      unique:true,
      trim: true,
    },
    email: {
      type: String,
      required: "EmailId is FRequired",
      lowercase: true,
      trim: true,
      unique: true,
    },
     password: {
      type: String,
      trim: true,
      required: "Password is Required",
    },
    address: {
        street:{
            type: String,
            trim: true,
        },
        city:{
            type: String,
            trim: true,
        },
        pincode:{
            type: String,
            trim: true,
        }
      },
  }, { timestamps: true });

/************************************CONNECTION CREATED***************************************/
module.exports = mongoose.model("User", userSchema);
