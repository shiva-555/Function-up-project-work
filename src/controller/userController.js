const userModel=require("../models/userModel")
const jwt=require("jsonwebtoken")

const createUser=async function(req,res){
    try{
    userData=req.body
    let {title,name,phone,email,password} = userData
    // check if the data in req.body is present or not
    if(Object.keys(userData).length==0) { 
        return res.status(400).send({status:false,msg:"please provide with your userdetails"})
    }
    if (!title) {
        return res.status(400).send({status:false,msg:"title is missing"})
    }
    var regEx = /^[a-zA-Z]+/;
        // check it is valid title or not? (using regular expression)
        if (!regEx.test(title)) {
            return res.status(400).send({ status: false, msg: "title text is invalid" });
        }

        //check the title is valid or not ?
        if (!(["Mr", "Mrs", "Miss"].includes(title))) {
            return res.status(400).send({ status: false, msg: 'You Can enter Only [Mr, Mrs, Miss] in Title in this format ' });
        }


    // if(!name){
    //     return res.status(400).send({status:false,msg:"name is missing"})
    
    // var regName = “^[a-zA-Z]+( [a-zA-Z]+{2,30})$/


    //     if (!regName.test(name)) {
    //         return res.status(400).send({ status: false, msg: "name is invalid" });
    //     }
    // }


    if(!phone){
        return res.status(400).send({status:false,msg:"please provide your contact number"})
    }
     let regex = /^[0-9]{10}$/

    if(!regex.test(phone)) {
    return res.status(400).send({ status: false, message: "Please ensure that you have entered correct contact details" })
    }

    if(!email){
        return res.status(400).send({status:false,msg:"please provide your email"})
    }

    // let regex1 = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/
    // if(regex1.test(email)){
    //     return res.status(400).send({ status: false, message: "Please ensure that you have email address" })  
    // }

    if(!password){
        return res.status(400).send({status:false,msg:"please enter your password"})
    }

    // let regex2= /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
    // if(regex2.test(password)){
    //     return res.status(400).send({status:false,msg:"please provide valid password & password should be Minimum eight characters, at least one letter, one number and one special character:"})
    // }


    let data=await userModel.create(userData)
    return res.status(201).send({status:true,msg:"Successfully created user",data:data})

    }

    catch (err) {
        console.log("This is the error:", err.message)
        return res.status(500).send({ status: false, msg: err.message })
    }

}

const isValidBody = function(body){
    return Object.keys(body).length > 0
};

const createLogin = async function(req,res){
 try{
    const data=req.body;
    if(!isValidBody(data)){
        return res.status(400).send({status:false, msg:"please provide email and password"});
    }
    
    let { email,password } =data;

    // if i remove the key email and password it give me the error 500 

    if (!data.email && !data.password) return res.status(400).send({ status: false, msg: "BAD REQUEST!" })
    if(!isValidBody(email)){
        return res.status(400).send({status:false, msg:"please provide email"});
    }
    if(!isValidBody(password)){
        return res.status(400).send({status:false, msg:"please provide password"});
    }


 const checkcredentials = await userModel.findOne({
    email: data.email,
    password: data.password,
 });
 if(!checkcredentials){
    return res.status(400).send({status:false, msg:"Invalid Login Data"});
 }
 if(checkcredentials.email===0){
    return res.status(400).send({status:false, msg:"please provide with your email"});
 }
 let token = jwt.sign({ bookId: checkcredentials._id.toString()},
 "bookGroup72"
 )
 res.header("x-api-key",token);
 res.status(200).send({status:true,token:token});

}  catch (err) {
    console.log("This is the error:", err.message)
    return res.status(500).send({ status: false, msg: err.message })
}
};







module.exports.createUser=createUser
module.exports.createLogin=createLogin