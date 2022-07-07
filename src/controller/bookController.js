const bookModel = require("../models/bookModel")
const userModel = require("../models/userModel")
const jwt = require("jsonwebtoken")
const ObjectId = require('mongoose').Types.ObjectId;

const isValidObjectId = function (objectId) { return mongoose.Types.ObjectId.isValid(objectId) }

const createBook = async function (req, res) {
    try{
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
        return res.status(400).send({ status: false, msg: "Please Enter the ISBN" });
    }
    //  check if subcategory is present or not on body
    if (!subcategory) {
        return res.status(400).send({ status: false, msg: "Please Enter the ISBN" });
    }
    //  check if reviews is present or not on body
    if (!reviews) {
        return res.status(400).send({ status: false, msg: "Please Enter the reviews" });

    } //check if isDeleted is TRUE/FALSE ?
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

}catch(err){
    return res.status(500).send({status:false, msg: err.message})
}
}

const getBook = async function (req,res){
    let { title, excerpt, userId, category, releasedAt, reviews, ...rest } = req.query

    if (Object.keys(req.query).length ==0){
        return res.status(400).send({status:false , msg: "Please provide some inputs"})
    }
    if (Object.keys(rest).length>0){
        return res.status(400).send({status:false , msg: "Please provide suggested key  ex :title, excerpt, userId, category, releasedAt, reviews,"})
    }
    // check if Id enquery is valid or not
    if (!ObjectId.isValid(userId)){
        return res.status(400).send({status:false , msg: "invalid user id in query params"})
    }

    let data = await bookModel.find(({ $or: [{ title: title }, { excerpt: excerpt }, { userId:userId }, { category:category },{releasedAt: releasedAt},{reviews:reviews}] }))
    
    if (data.length !=0 ) return res.status(200).send({status:true , data:data })

    



}


module.exports.createBook = createBook
module.exports.getBook = getBook