const userModel=require("../models/userModel")
const jwt=require("jsonwebtoken")

const createUser=async function(req,res){
    userData=req.body
    let data=await userModel.create(userData)
    return res.status(201).send({status:true,msg:"Successfully created user",data:data})

}

module.exports.createUser=createUser