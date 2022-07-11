const jwt = require("jsonwebtoken");
const bookModel = require("../models/bookModel");
const reviewModel = require("../models/reviewModel")
const ObjectId = require('mongoose').Types.ObjectId;






authentication = async function (req, res, next) {
    try {
        //check the token in request header
        //validate this token
        let token = req.headers["x-api-key"];
        if (!token) token = req.headers["x-api-key"];

        //If no token is present in the request header ,return error
        if (!token) return res.status(400).send({ status: false, msg: "token must be present" });

        let decodedToken;
        //it verify the token
        try {
            decodedToken = jwt.verify(token, "Group72");
        } catch (err) {
            return res.status(400).send({ status: false, msg: err.message + " Please enter valid token in header body" })
        }
        next()
    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
};


authorization = async function (req, res, next) {
    try {
        let token = req.headers["x-api-key"];
        if (!token) token = req.headers["x-api-key"];

        let decodedToken;
        //verify the token
        try {
            decodedToken = jwt.verify(token, "Group72");
        } catch (err) {
            return res.status(400).send({ status: false, msg: err.message + " Please enter valid token in header body" })
        }


        // execute if req.body will contain userId (When new Book is Created)
        if (req.body.userId) {
            if (decodedToken.userId != (req.body.userId)) {
                return res.status(403).send({ status: false, msg: "token auth id and req.body id is not matched" })
            }
            return next()
        }

        // executes when we need to fetch the userId from BlogID (when UPADTE API CAlls)
        if (req.params.bookId) {
            let bookId = req.params.bookId
            //check the book Id is Valid or Not ?
            if (!ObjectId.isValid(bookId)) {
                return res.status(400).send({ status: false, msg: "Blog Id in url: is Invalid" });
            }
            let authIdData = await bookModel.findById(bookId).select("userId")

            if (!authIdData) {
                return res.status(400).send({ status: false, msg: "Book Id is Invalid" });
            }

            if (decodedToken.userId != authIdData.userId) {
                return res.status(400).send({ status: false, msg: "token auth id and req.body id is not matched" })
            }
            return next()
        }


        //executes when we need userID from query params, (when UPDATE with Query Param filter)
        if (req.query.userId) {
            if (decodedToken.userId != (req.query.userId)) {
                return res.status(400).send({ status: false, msg: "token auth id and req.body id is not matched" })
            }
            return next()
        }

        //if no user Id is not Found from client Api ,Side
        else {
            return res.status(400).send({ status: false, mg: " user id Must be Present ......." })
        }

        // if (req.query.bookId) {
        //     if (decodedToken.userId != (req.query.bookId)) {
        //         return res.status(400).send({ status: false, msg: "token auth id and req.body id is not matched" })
        //     }
        //     return next()
        // }



    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}




module.exports.authentication = authentication
module.exports.authorization = authorization