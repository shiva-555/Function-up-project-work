
const mongoose = require('mongoose');
const bookModel = require("../models/bookModel")
const userModel = require("../models/userModel")
const reviewModel = require("../models/reviewModel")
const ObjectId = require('mongoose').Types.ObjectId;


// const isValidObjectId = function (objectId) { return mongoose.Types.ObjectId.isValid(objectId) }



const createBook = async function (req, res) {
    try {
        let bookData = req.body
        let {BookCover,title, excerpt, userId, ISBN, category, subcategory, isDeleted, releasedAt, deletedAt } = req.body

        //check if the data in request body is present or not ?
        if (!Object.keys(bookData).length) {
            return res.status(400).send({ status: false, msg: "Please Enter the Data in Request Body" });
        }

        if (!title) return res.status(400).send({ status: false, msg: "Please Enter the Title" });
        if (!BookCover) return res.status(400).send({ status: false, msg: "Please Enter the BookCover" });
        if (!excerpt) return res.status(400).send({ status: false, msg: "Please Enter the excerpt" });
        if (!userId) return res.status(400).send({ status: false, msg: "Please Enter the userId" });
        if (!ISBN) return res.status(400).send({ status: false, msg: "Please Enter the ISBN" });
        if (!category) return res.status(400).send({ status: false, msg: "Please Enter the category" });
        if (!subcategory) return res.status(400).send({ status: false, msg: "Please Enter the subcategory" });
        if (!releasedAt) return res.status(400).send({ status: false, msg: "Please Enter the releaseAt" });

        //check if isDeleted is TRUE/FALSE ?
        if (isDeleted && (!(typeof isDeleted === "boolean"))) {
            return res.status(400).send({ status: false, msg: "isDeleted Must be TRUE OR FALSE" });
        }
        //  if isDeleted is true add the current Time&Date in deletedAt?
        if (isDeleted) {
            bookData.deletedAt = new Date()
        }
        // if releasedAt  add the current Time&Date in releasedAt?
        if (releasedAt) {
            bookData.releasedAt = new Date()
        }
        //check the title unique or not 
        let findTitle = await bookModel.findOne({ title: title })
        if (findTitle) {
            return res.status(400).send({ status: false, msg: "title is Already Present in DB" })
        }
        var regEx = /^[a-zA-Z]+/;
        // check it is valid title or not? (using regular expression)
        if (!regEx.test(title)) {
            return res.status(400).send({ status: false, msg: "title text is invalid" });
        }
        //check if id is present in Db or Not ? 
        let user = await userModel.findById(userId)
        if (!user) return res.status(404).send({ status: false, msg: "This Id is not present in user DB" })

        //check the author Id is Valid or Not ?
        if (!ObjectId.isValid(userId)) {
            return res.status(400).send({ status: false, msg: "Id is Invalid" });
        }

        //check if ISBN is present in Db or Not ?
        let duplicateISBN = await bookModel.findOne({ ISBN: bookData.ISBN });
        if (duplicateISBN) {
            return res.status(400).send({ status: false, msg: " ISBN already exist" });
        }
        // check it is valid category or not? (using regular expression)
        if (!regEx.test(category)) {
            return res.status(400).send({ status: false, msg: "category text is invalid" });
        }
        // if all condition are passed create books data in data base
        let data = await bookModel.create(bookData)
        return res.status(201).send({ status: true, data: data })

    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}

// ********************getbook*********************

const getBook = async function (req, res) {
    let { userId, category, subcategory, ...rest } = req.query

    if (Object.keys(rest).length > 0) {
        return res.status(400).send({ status: false, msg: "Please provide suggested key  ex : userId, category, sucategory" })
    }

    // check if any query param is present
    if (Object.keys(req.query).length !== 0) {
        req.query.isDeleted = false
        let data = await bookModel.find(req.query)
        if (data.length != 0) return res.status(200).send({ status: true, data: data })

        return res.status(404).send({ status: false, msg: "No document found as per filter key" })
    }

    //  return the data if isDeleted false  //  sort here we use to sort the title in alphabetically
    let data = await bookModel.find(req.query).sort({ title: 1 }).select({ createdAt: 0, updatedAt: 0, __v: 0, deletedAt: 0, subcategory: 0, isDeleted: 0, ISBN: 0 })

    if (data.length != 0) return res.status(200).send({ status: true, data: data })
    return res.status(404).send({ status: false, msg: " no document are found" })
}

// *************************GET BOOK BI ID************************


/*********************************************[GET BOOK BY ID IN PATH PARAM]*****************************************************/
const getBookById = async function (req, res) {
    try {

        let bookId = req.params.bookId
        if (!ObjectId.isValid(bookId)) return res.status(400).send({ status: false, message: "Book Id is Invalid !!!!" })

        booksData = await bookModel.findOne({ _id: bookId, isDeleted: false }).select({ ISBN: 0 }).lean()
        if (!booksData) return res.status(404).send({ status: false, message: "No Books Found As per BookID" })

        reviewsData = await reviewModel.find({ bookId: bookId, isDeleted: false }).select({ isDeleted: 0, createdAt: 0, updatedAt: 0, __v: 0 })
        if (!reviewsData) return res.status(404).send({ status: false, message: "No Reviews Found As per BookID" })
        booksData.reviewsData = reviewsData
        return res.status(200).send({ status: true, message: 'Books list', data: booksData })

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message });
    }
}

// ******************************************UPDATE BOOK***********************************************


const updateBookById = async function (req, res) {
    try {
        let bookId = req.params.bookId
        let data = req.body
        let { title, excerpt, userId, ISBN, category, subcategory, reviews, deletedAt, isDeleted, releasedAt } = req.body


        //check if id is present in Db or Not ? 
        let books = await bookModel.findById(bookId)
        if (!books) return res.status(404).send({ status: false, msg: "bookId is not present in DB " })

        // check if isDeleated Status is True
        if (books.isDeleted) return res.status(404).send({ status: false, msg: "book is Already Deleted" })

        //check if the data in request body is present or not ?
        if (!Object.keys(data).length) {
            return res.status(400).send({ status: false, msg: "Please Enter the Data in Request Body" });
        }

        if (!title)  return res.status(400).send({ status: false, msg: "Please Enter the title " });
        if (!excerpt) return res.status(400).send({ status: false, msg: "Please Enter the excerpt " });
        if (!ISBN) return res.status(400).send({ status: false, msg: "Please provide ISBN" });
            
        
        //check the book Id is Valid or Not ?  
        if (!ObjectId.isValid(bookId)) {
            return res.status(400).send({ status: false, msg: "bookId is Invalid" });
        }

        //check if isDeleted is TRUE/FALSE ?
        if (isDeleted && (!(typeof isDeleted === "boolean"))) {
            return res.status(400).send({ status: false, msg: "isDeleted Must be TRUE OR FALSE" });
        }

        // if releasedAt  add the current Time&Date in releasedAt?
        if (releasedAt) {
            data.releasedAt = Date.now()
        }

        //check the title unique or not 
        let findTitle = await bookModel.findOne({ title: title })
        if (findTitle) {
            return res.status(400).send({ status: false, msg: "title is Already Present in DB" })
        }

        //check the ISBN unique or not 
        let findISBN = await bookModel.findOne({ ISBN: ISBN })
        if (findISBN) {
            return res.status(400).send({ status: false, msg: "ISBN is Already Present in DB" })
        }

        //check if body is empty or not ?
        if (!Object.keys(data).length) {
            return res.status(400).send({ status: false, msg: "Noting to Update in Request from Body" });
        }

        var regEx = /^[a-zA-Z ]{2,100}$/
        // check it is valid title or not? (using regular expression)
        if (!regEx.test(title)) {
            return res.status(400).send({ status: false, msg: "title text is invalid" });
        }

        // check it is valid excerpt or not? (using regular expression)
        if (!regEx.test(excerpt)) {
            return res.status(400).send({ status: false, msg: "excerpt text is invalid" });
        }

        // check it is valid category or not? (using regular expression)
        if (!regEx.test(category)) {
            return res.status(400).send({ status: false, msg: "category text is invalid" });
        }

        // check it is valid subcategory or not? (using regular expression)
        if (!regEx.test(subcategory)) {
            return res.status(400).send({ status: false, msg: "subcategory text is invalid" });
        }
        // check it is valid ISBN or not? (using regular expression)
        const regex = /^[\d*\-]{10}|[\d*\-]{13}$/

        if (!regex.test(ISBN)) {
            return res.status(400).send({ status: false, msg: "ISBN text is invalid" });
        }

        // delete data.subcategory

        let updateData = await bookModel.findByIdAndUpdate(bookId, { $set: data }, { new: true })

        return res.status(200).send({ status: true, data: updateData });

    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}

// ****************************************DELEETE BOOK BY ID***********************************************


const deletedBook = async function (req, res) {
    try {
        let bookId = req.params.bookId;
        if (!ObjectId.isValid(bookId)) return res.status(400).send({ status: false, message: "Book Id is Invalid !!!!" })

        let book = await bookModel.findById(bookId);

        //check if isDeleated Status is True
        if (book.isDeleted) {
            return res.status(404).send({ status: false, msg: "Book is already Deleted" })
        }

        //update the status of isDeleted to TRUE
        let updatedData = await bookModel.findOneAndUpdate({ _id: bookId, isDeleted: false }, { isDeleted: true, deletedAt: new Date(), }, { new: true });
        if (!updatedData) { return res.status(404).send({ status: false, message: "No Books Found As per BookID" }) }
        return res.status(200).send({ status: true, msg: "successfuly Deleted", data: updatedData });


    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}


module.exports.createBook = createBook
module.exports.getBook = getBook
module.exports.getBookById = getBookById
module.exports.updateBookById = updateBookById
module.exports.deletedBook = deletedBook

