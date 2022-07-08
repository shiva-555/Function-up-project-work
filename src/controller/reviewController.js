const bookModel = require("../models/bookModel")
const userModel = require("../models/userModel")
const reviewModel = require("../models/reviewModel")
const jwt = require("jsonwebtoken")
const ObjectId = require('mongoose').Types.ObjectId;

// const isValidObjectId = function (objectId) { return mongoose.Types.ObjectId.isValid(objectId) }

const createReview = async function (req, res) {
    try {
        let reviewsData = req.body

        let { bookId, reviewedBy, reviewedAt, rating, review, isDeleted } = req.body

        if (!Object.keys(reviewsData).length) {
            return res.status(400).send({ status: false, msg: "Please enter the review Details" });
        }

        // check bookId is present or not
        if (!bookId) {
            return res.status(400).send({ status: false, msg: "please provide book id " })
        }
        // check reviewedBy is present or not
        if (!reviewedBy) {
            return res.status(400).send({ status: false, msg: "please provide reviewedBy  " })
        }
        // check reviewedAt is present or not
        if (!reviewedAt) {
            return res.status(400).send({ status: false, msg: "please provide reviewedAt  " })
        }
        // check rating is present or not
        if (!rating) {
            return res.status(400).send({ status: false, msg: "please provide rating " })
        }

        //check if isDeleted is TRUE/FALSE ?
        if (isDeleted && (!(typeof isDeleted === "boolean"))) {
            return res.status(400).send({ status: false, msg: "isDeleted Must be TRUE OR FALSE" });
        }

        //  if isDeleted is true add the current Time&Date in deletedAt?
        if (isDeleted) {
            bookData.deletedAt = new Date()
        }

        // if releasedAt  add the current Time&Date in releasedAt?
        if (reviewedAt) {
            reviewsData.reviewedAt = Date.now()
        }

        // check bookId present or not
        let findBooks = await bookModel.findById(bookId)
        if (findBooks) {
            return res.status(400).send({ status: false, msg: "bookId is Already Present in DB" })
        }

        // check bookId valid or not
        let findBook = await bookModel.findById(bookId)
        if (!findBook) {
            return res.status(404).send({ status: false, message: "BookId Not Found" })
        }
        reviewsData.bookId = findBook._id

        // check rating between 1-5
        if (!(reviewsData.rating >= 1 && reviewsData.rating <= 5)) {
            return res.status(400).send({ status: false, message: "Rating must be in between 1 to 5." })
        }

        // if all condition are passed then data will be create
        if (Object.keys(reviewsData.length != 0)) {
            const data = await reviewModel.create(reviewsData)
            return res.status(201).send({ status: true, msg: "Create successfully", data: data })
        }
        else {
            return res.status(400).send({ status: false, msg: "Bad Request" })
        }
        
    } catch (error) {
        return res.status(500).send({ status: false, msg: error.message })
    }
}







module.exports.createReview = createReview