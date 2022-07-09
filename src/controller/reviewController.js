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
<<<<<<< HEAD
        
=======
        // check reviewedAt is present or not
        if (!reviewedAt) {
            return res.status(400).send({ status: false, msg: "please provide reviewedAt  " })
        }
>>>>>>> 6c981a34bdbe18466c8fb9a2178ca1014f81fdb5
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
<<<<<<< HEAD
        // let findBooks = await bookModel.findById(bookId)
        // if (findBooks) {
        //     return res.status(400).send({ status: false, msg: "bookId is Already Present in DB" })
        // }
=======
        let findBooks = await bookModel.findById(bookId)
        if (findBooks) {
            return res.status(400).send({ status: false, msg: "bookId is Already Present in DB" })
        }
>>>>>>> 6c981a34bdbe18466c8fb9a2178ca1014f81fdb5

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
<<<<<<< HEAD
            return res.status(201).send({ status: true, msg: "Create successfully", data: data }), { $inc: { review: 1 } }
=======
            return res.status(201).send({ status: true, msg: "Create successfully", data: data }), { $inc: { reviews: 1 } }
>>>>>>> 6c981a34bdbe18466c8fb9a2178ca1014f81fdb5
        }
        else {
            return res.status(400).send({ status: false, msg: "Bad Request" })
        }
    } catch (error) {
        return res.status(500).send({ status: false, msg: error.message })
    }
}


const updateReview = async function (req, res) {
<<<<<<< HEAD
    try{
=======

>>>>>>> 6c981a34bdbe18466c8fb9a2178ca1014f81fdb5
    let reviewId = req.params.reviewId
    let data = req.body
    let { bookId, reviewedBy, reviewedAt, rating, review, isDeleted } = req.body

<<<<<<< HEAD
    //check the review Id is Valid or Not ?
    if (!ObjectId.isValid(reviewId)) {
        return res.status(400).send({ status: false, msg: "reviewId is Invalid" });
    }

    //check if the data in request body is present or not ?
    if (!Object.keys(data).length) {
        return res.status(400).send({ status: false, msg: "Noting to Update Request from Body" });
    }

    if (!ObjectId.isValid(bookId)) {
        return res.status(400).send({ status: false, msg: "bookId must be valid" });
    }

    // check if id is present in Db or Not ? 
    let books = await bookModel.findById(bookId)
    if (!books) return res.status(404).send({ status: false, msg: "bookId is not match that you provide in url " })

=======
    //check if the data in request body is present or not ?
    if (!Object.keys(data).length) {
        return res.status(400).send({ status: false, msg: "Please Enter the Data in Request Body" });
    }

    // check bookId is present or not
    if (!bookId) {
        return res.status(400).send({ status: false, msg: "Please Enter bookId " });
    }
    // check reviewedBy is present or not
    if (!reviewedBy) {
        return res.status(400).send({ status: false, msg: "Please Enter reviewedBy " });
    }
    // check rating is present or not
    if (!rating) {
        return res.status(400).send({ status: false, msg: "please provide rating " })
    }
    // check reviewedAt is present or not
    if (!reviewedAt) {
        return res.status(400).send({ status: false, msg: "Please Enter reviewedAt " });
    }

    //check the book Id is Valid or Not ?  
    if (!ObjectId.isValid(bookId)) {
        return res.status(400).send({ status: false, msg: "bookId is Invalid" });
    }

>>>>>>> 6c981a34bdbe18466c8fb9a2178ca1014f81fdb5
    //check if isDeleted is TRUE/FALSE ?
    if (isDeleted && (!(typeof isDeleted === "boolean"))) {
        return res.status(400).send({ status: false, msg: "isDeleted Must be TRUE OR FALSE" });
    }
<<<<<<< HEAD
=======
    //check if id is present in Db or Not ? 
    let findReview = await reviewModel.findById(reviewId)
    if (!findReview) return res.status(404).send({ status: false, msg: "bookId is not present in DB" })
>>>>>>> 6c981a34bdbe18466c8fb9a2178ca1014f81fdb5

    // check if isDeleated Status is True
    if (books.isDeleted) return res.status(404).send({ status: false, msg: "book is Already Deleted" })

<<<<<<< HEAD
    // if releasedAt  add the current Time&Date in releasedAt?
    if (reviewedAt) {
        data.reviewedAt = Date.now()
    }

    //check if id is present in Db or Not ? 
    let findReview = await reviewModel.findById(reviewId)
    if (!findReview) return res.status(404).send({ status: false, msg: "reviewId is not present in DB" })

    var regEx = /^[a-zA-Z ]{2,100}$/
    // check it is valid name or not? (using regular expression)
    if (!regEx.test(reviewedBy)) {
        return res.status(400).send({ status: false, msg: " name is invalid , name must be 2 digits " });
=======
    //check if body is empty or not ?
    if (!Object.keys(data).length) {
        return res.status(400).send({ status: false, msg: "Noting to Update in Request from Body" });
    }

    var regEx = /^[a-zA-Z ]{2,100}$/
    // check it is valid name or not? (using regular expression)
    if (!regEx.test(reviewedBy)) {
        return res.status(400).send({ status: false, msg: "title text is invalid" });
>>>>>>> 6c981a34bdbe18466c8fb9a2178ca1014f81fdb5
    }

    // check rating between 1-5
    if (!(data.rating >= 1 && data.rating <= 5)) {
        return res.status(400).send({ status: false, message: "Rating must be in between 1 to 5." })
    }
    // check it is valid review or not? (using regular expression)
    if (!regEx.test(review)) {
        return res.status(400).send({ status: false, msg: "review text is invalid" });
    }

    let updateReview = await reviewModel.findByIdAndUpdate(reviewId, { $set: data }, { new: true })

    return res.status(200).send({ status: true, data: updateReview });

<<<<<<< HEAD
}catch(err){
    return res.status(500).send({status: false , msg: err.message})
}
}


const deletedReview = async function (req, res) {
    try{
    let bookId = req.params.bookId;
    let reviewId = req.params.reviewId

    //check the review Id is Valid or Not ?
    if (!ObjectId.isValid(reviewId)) {
        return res.status(400).send({ status: false, msg: "reviewId is Invalid" });
    }
    let findReview= await reviewModel.findById(reviewId)
    if (!findReview) {
        return res.status(404).send({status:false , msg: 'review id not found '})
    }

    //check the bookId is Valid or Not ?
    if (!ObjectId.isValid(bookId)) {
        return res.status(400).send({ status: false, msg: "url revewid is not match in db'" });
    }

    let review = await reviewModel.findById(reviewId)
    //check if isDeleated Status is True
    if (review.isDeleted) {
        return res.status(404).send({ status: false, msg: "Book is already Deleted" })
    }

    let book = await bookModel.findById(bookId);
    //check if isDeleated Status is True
    if (book.isDeleted) {
        return res.status(404).send({ status: false, msg: "Book is already Deleted" })
    }

    //update the status of isDeleted to TRUE
    let updatedData = await reviewModel.findOneAndUpdate({ _id: reviewId }, { isDeleted: true, deletedAt: new Date(), }, { new: true });
    return res.status(200).send({ status: true, msg: "successfuly Deleted" });
}catch(err){
    return res.status(500).send({status:false,msg: err.message})
}
=======
>>>>>>> 6c981a34bdbe18466c8fb9a2178ca1014f81fdb5
}



<<<<<<< HEAD
module.exports.createReview = createReview
module.exports.updateReview = updateReview
module.exports.deletedReview = deletedReview
=======

module.exports.createReview = createReview
module.exports.updateReview = updateReview
>>>>>>> 6c981a34bdbe18466c8fb9a2178ca1014f81fdb5
