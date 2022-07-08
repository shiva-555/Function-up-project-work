const bookModel = require("../models/bookModel")
const userModel = require("../models/userModel")
const reviewModel = require("../models/reviewModel")
const jwt = require("jsonwebtoken")
const ObjectId = require('mongoose').Types.ObjectId;



const createReview = async function(req,res){
    try {
        let reviewsData = req.body

        if (!Object.keys(reviewsData).length) {
            return res.status(400).send({ status: false, msg: "Please enter the review Details" });
        }

        if (Object.keys(reviewsData.length != 0)) {
            const data = await reviewModel.create(reviewsData)
            return res.status(201).send({ status: true, msg: "Create successfully", data : data})
       }
        else{
            return res.status(400).send({status:false,msg:"Bad Request"})
        }
        // let bookById=req.params.bookId
        // //let checkData=req.body.isDeleted
        // if(!bookById){
        //     return res.status(400).send({status:false,msg:"Invalid BOOK ID"})
        // }
        // if(!checkData){
        //     return res.status(400).send({status:false,msg:"Data"})
        // }
    } catch (error) {
        return res.status(500).send({ status: false, msg: error.message })
    }
}







module.exports.createReview = createReview