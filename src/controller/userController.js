const userModel = require("../models/userModel")
var validator = require("email-validator")
const jwt = require("jsonwebtoken")


const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) {
        return false
    }
    if (typeof value === 'string' && value.trim().length === 0) {
        return false
    }
    return true
}


const createUser = async function (req, res) {
    try{
    userData = req.body
    let { title, name, phone, email, password, address, ...rest} = userData

    // check if the data in req.body is present or not
    if (!Object.keys(userData).length) {
        return res.status(400).send({ status: false, msg: "please provide userdetails" })
    }
    // check if any unwanted attribute in req body is present or not ?
    if (Object.keys(rest).length > 0) {
        return res.status(400).send({ status: false, msg: " please enter the valid attribute field" })
    }
    // check if title,name,phone,email,password is present or not
    if (!title) {
        return res.status(400).send({ status: false, msg: " title missing" })
    }
    if (!name) {
        return res.status(400).send({ status: false, msg: " name missing" })
    }
    if (!phone) {
        return res.status(400).send({ status: false, msg: " phone missing" })
    }
    if (!email) {
        return res.status(400).send({ status: false, msg: " email missing" })
    }
    if (!password) {
        return res.status(400).send({ status: false, msg: " password missing" })
    }

    // check  title pattern is valid or not? (using regular expression)
    var regEx = /^[a-zA-Z]+/;
    if (!regEx.test(title)) {
        return res.status(400).send({ status: false, msg: "title text is invalid" });
    }
    //check the title is valid or not ?
    if (!(["Mr", "Mrs", "Miss"].includes(title))) {
        return res.status(400).send({ status: false, msg: 'You Can enter Only [Mr, Mrs, Miss] in Title in this format ' });
    }
    // check name is valid name or not?  (for this we used regular expression is here) 
    var nameRegex=/^[a-zA-Z ]{2,10}$/

    if (!nameRegex.test(name)) {
        return res.status(400).send({ status: false, msg: "name shold be more then 1 character " });
    }
    // check mobile no valid or not
    if (!isValid(phone)) return res.status(400).send({ status: false, message: "users's phone no is required." })
        
    // check mobile pattern
    var mobileRegex = /^[0]?[6789]\d{9}$/
    if (!mobileRegex.test(phone)) {
        return res.status(400).send({ status: false, message: "Please provide a valid mobile number, it should start 6-9.(you can also use STD code 0)" })
    }
    // check mobile no present in database or not
    let usedMobile = await userModel.findOne({ phone })
    if (usedMobile) {
        return res.status(400).send({ status: false, message: "Mobile no already exists. Please provide another mobile number" })
    }
    //check if email id is valid or not ?  --->used "email-validator"
    if (!(validator.validate(email))) {
        return res.status(400).send({ status: false, msg: "Email Id is Invalid" });
    }
    //check the email present in database or not 
    let emailFlag = await userModel.findOne({ email: email })
    if (emailFlag) {
        return res.status(400).send({ status: false, msg: "E-mail is Already Present in DB" })
    }
    //check if password is valid or not ?
    var passwordReg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/;
    if (!passwordReg.test(password)) {
        return res.status(400).send({ status: false, msg: "pass is invalid(Minimum 8 and maximum 15 characters, at least one uppercase letter, one lowercase letter, one number and one special character Ex. Abc@123,abC%98,@abD34,1999$Sour" });
    } 
    // if all condition are passed create user data
    let data = await userModel.create(userData)
        return res.status(201).send({ status: true, msg: "succesfully created" , data: data })
} catch (error){
    return res.status(500).send({status:false, msg: error.message})
}
}

///////////////////////////////////////////////////****CREATE LOGIN****///////////////////////////////////////////////

// const createLogin = async function (req, res) {
//     try {
//         const data = req.body;
//         if (!isValidBody(data)) {
//             return res.status(400).send({ status: false, msg: "please provide email and password" });
//         }

//         let { email, password } = data;

//         // if i remove the key email and password it give me the error 500 

//         if (!data.email && !data.password) return res.status(400).send({ status: false, msg: "BAD REQUEST!" })
//         if (!isValidBody(email)) {
//             return res.status(400).send({ status: false, msg: "please provide email" });
//         }
//         if (!isValidBody(password)) {
//             return res.status(400).send({ status: false, msg: "please provide password" });
//         }


//         const checkcredentials = await userModel.findOne({
//             email: data.email,
//             password: data.password,
//         });
//         if (!checkcredentials) {
//             return res.status(400).send({ status: false, msg: "Invalid Login Data" });
//         }
//         if (checkcredentials.email === 0) {
//             return res.status(400).send({ status: false, msg: "please provide with your email" });
//         }
//         let token = jwt.sign({ bookId: checkcredentials._id.toString() },
//             "bookGroup72"
//         )
//         res.header("x-api-key", token);
//         res.status(200).send({ status: true, token: token });

//     } catch (err) {
//         return res.status(500).send({ status: false, msg: err.message })
//     }
// };

const createLogin = async function (req, res) {
    try {
         let { email, password } = req.body;
        
         //check if the data in request body is present or not ?
        if (!Object.keys(req.body).length) {
            return res.status(400).send({ status: false, msg: "Please Enter the email and password in Request Body" });
        }

        if (!email) {
            return res.status(400).send({ status: false, msg: "Missing email" });
        }

        //check if password is present or not
        if (!password) {
            return res.status(400).send({ status: false, msg: "PassWord is Required" });
        }

        // find the object as per email & password
        let user = await userModel.findOne({ email: email, password: password });

        if (!user) return res.status(401).send({ status: false, msg: "email or password is not corerct", });

        //create the Token 
        let token = jwt.sign(
            {
                userId: user._id.toString(),
                name: user.name 
            },
            "Group72"
        );

        res.setHeader("x-api-key", token);
        res.status(201).send({ status: true, data: token });

    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
};







module.exports.createUser = createUser
module.exports.createLogin = createLogin