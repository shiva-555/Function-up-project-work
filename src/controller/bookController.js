const bookModel1=require("../models/bookModel")
const userModel1=require("../models/userModel")
const jwt=require("jsonwebtoken")

const isValidObjectId = function (objectId) { return mongoose.Types.ObjectId.isValid(objectId) }

const createBook= async function(req,res){
    try{
    let bookdata = req.body.userId
    data= req.body

    if (!isValidObjectId(data.userId)) {
        return res.status(400).send({ status: false, msg: "userId is invalid!" })
    }

    let validbook = await userModel.findById({ _id: bookdata })
        if (!validbook) {
            return res.status(404).send({ status: false, msg: "userId not found!" })
        }

        if (Object.keys(data).length != 0) {
            let savedData = await bookModel.create(data)
            return res.status(201).send({ msg: savedData })
        }
        else return res.status(400).send({ msg: "BAD REQUEST" })
    }
    catch (err) {
        console.log("This is the error:", err.message)
        return res.status(500).send({ msg: "Error", error: err.message })
    }
}


module.exports.createBook=createBook