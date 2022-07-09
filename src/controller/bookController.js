const bookModel = require("../models/bookModel")
const userModel = require("../models/userModel")
const ObjectId = require('mongoose').Types.ObjectId;


const createBook = async function (req, res) {
    try {
        let bookData = req.body
        let { title, excerpt, userId, ISBN, category, subcategory, reviews, isDeleted, releasedAt } = req.body

        //check if the data in request body is present or not ?
        if (!Object.keys(bookData).length) {
            return res.status(400).send({ status: false, msg: "Please Enter the Data in Request Body" });
        }
        //check Title is Present or Not ?
        if (!title) {
            return res.status(400).send({ status: false, msg: "Please Enter the Title" });
        }
        // check excerpt is present or not
        if (!excerpt) {
            return res.status(400).send({ status: false, msg: "Please Enter the xcerpte" });
        }
        // check userId presnt or not in req.body
        if (!userId) {
            return res.status(400).send({ status: false, msg: "Please Enter the userId" });
        }
        //check ISBN is present or not 
        if (!ISBN) {
            return res.status(400).send({ status: false, msg: "Please Enter the ISBN" });
        }
        //  check if category is present or not on body
        if (!category) {
            return res.status(400).send({ status: false, msg: "Please Enter the category" });
        }
        //  check if subcategory is present or not on body
        if (!subcategory) {
            return res.status(400).send({ status: false, msg: "Please Enter the ISBN" });
        }
        //  check if reviews is present or not on body
        if (!reviews) {
            return res.status(400).send({ status: false, msg: "Please Enter the reviews" });

        }
        //check if isDeleted is TRUE/FALSE ?
        if (isDeleted && (!(typeof isDeleted === "boolean"))) {
            return res.status(400).send({ status: false, msg: "isDeleted Must be TRUE OR FALSE" });
        }

        //  if isDeleted is true add the current Time&Date in deletedAt?
        if (isDeleted) {
            bookData.deletedAt = new Date()
        }
        //  check releasedAt present or not in body

        if (!releasedAt) {
            return res.status(400).send({ status: false, msg: "Please Enter the releaseAt" });
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



const getBook = async function (req, res) {
    let { userId, category, subcategory , ...rest } = req.query


    if (Object.keys(rest).length > 0) {
        return res.status(400).send({ status: false, msg: "Please provide suggested key  ex : userId, category, sucategory" })
    }

    // check if any query param is present
    if (Object.keys(req.query).length !== 0) {

        // check if Id enquery is valid or not
        // if (!ObjectId.isValid(userId)) {
        //     return res.status(400).send({ status: false, msg: "invalid user id in query params" })
        // }
        // add the key isDeleted in req.query
        req.query.isDeleted = false

        // find data as per para , query filter
        let data = await bookModel.find(req.query)


        // check if data is found or not
        if (data.length != 0) return res.status(200).send({ status: true, data: data })

        return res.status(404).send({ status: false, msg: "No document found as per filter key" })
    }

    //  return the data if isDeleted false 

    let data = await bookModel.find({ isDeleted: false }).sort({ title: 1 }) //  sort here we use to sort the title in alphabetically
    if (data.length != 0) return res.status(200).send({ status: true, data: data })

    return res.status(404).send({ status: false, msg: " no document are found" })
}



/*********************************************[GET BOOK BY ID IN PATH PARAM]*****************************************************/
const getBookById = async function (req, res) {
    try {

        let book_id = req.params.bookId

        if (!isValidObjectId(book_id)) return res.status(400).send({ status: false, message: "Invalid bookId." })

        let checkBook = await bookModel.findOne({ _id:book_id, isDeleted: false })

        if (!checkBook) return res.status(400).send({ status: false, message: "BookId Not Found" })

        const getReviewsData = await reviewModel.find({ bookId: checkBook._id, isDeleted: false })
            .select({ deletedAt: 0, isDeleted: 0, createdAt: 0, __v: 0, updatedAt: 0 })

        checkBook.reviewsData = getReviewsData

        res.status(200).send({ status: true, message: "Book List", data: checkBook })

    } catch (err) {
        res.status(500).send({ status: false, error: err.message })
    }
}

// ******************************************UPDATE BOOK***********************************************


const updateBookById = async function (req, res) {
    try {
        let bookId = req.params.bookId
        let data = req.body
        let { title, excerpt, userId, ISBN, category, subcategory, reviews, deletedAt, isDeleted, releasedAt } = req.body



        //check if the data in request body is present or not ?
        if (!Object.keys(data).length) {
            return res.status(400).send({ status: false, msg: "Please Enter the Data in Request Body" });
        }

        if (!title) {
            return res.status(400).send({ status: false, msg: "Please Enter the title " });
        }

        if (!excerpt) {
            return res.status(400).send({ status: false, msg: "Please Enter the excerpt " });
        }
        if (!ISBN) {
            return res.status(400).send({ status: false, msg: "Please provide ISBN" });
        }
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

        //check if id is present in Db or Not ? 
        let books = await bookModel.findById(bookId)
        if (!books) return res.status(404).send({ status: false, msg: "bookId is not present in DB" })

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

        // check if isDeleated Status is True
        if (books.isDeleted) return res.status(404).send({ status: false, msg: "book is Already Deleted" })

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
        let book = await bookModel.findById(bookId);

        //check if isDeleated Status is True
        if (book.isDeleted) {
            return res.status(404).send({ status: false, msg: "Book is already Deleted" })
        }

        //update the status of isDeleted to TRUE
        let updatedData = await bookModel.findOneAndUpdate({ _id: bookId }, { isDeleted: true, deletedAt: new Date(), }, { new: true });
        return res.status(200).send({ status: true, msg: "successfuly Deleted" });

    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}


module.exports.createBook = createBook
module.exports.getBook = getBook
module.exports.getBookById=getBookById
module.exports.updateBookById = updateBookById
module.exports.deletedBook = deletedBook
