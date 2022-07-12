/***********************************REQUIRE MONGOOSE LIBARARY*********************************/
const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    excerpt: {
      type: String,
      required: true,
    },
    userId: {
      type: ObjectId,
      ref: "User",
      required: true
    },
    ISBN: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    subcategory: {
      type: [String] ,
      required: true,
      trim: true,
    },
    
    reviews: {
      type: Number,
      trim: true,
      default: 0
    },
    deletedAt: {
      default: null, 
      type: Date
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    releasedAt: {
      type: Date,
      required: true
    },
  }, { timestamps: true });

/************************************CONNECTION CREATED***************************************/
module.exports = mongoose.model("Book", bookSchema);
