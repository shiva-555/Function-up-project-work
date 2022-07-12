const express=require("express")
const router=express.Router()
// const moment = require("moment")
const userController=require("../controller/userController")
const bookController=require("../controller/bookController")
const reviewController=require("../controller/reviewController")
const mw =require("../middleware/middlewareController")




router.post("/register",userController.createUser)
router.post("/login",userController.createLogin)
router.post("/books", mw.authentication,mw.authorization, bookController.createBook)
router.get("/books", mw.authentication ,bookController.getBook)
router.get("/books/:bookId",mw.authentication, bookController.getBookById)
router.put("/books/:bookId",mw.authentication,mw.authorization, bookController.updateBookById)
router.delete("/books/:bookId",mw.authentication, mw.authorization, bookController.deletedBook)

// ************REVIWS API*******************************

router.post("/books/:bookId/review",mw.authentication, reviewController.createReview)
router.put("/books/:bookId/review/:reviewId",mw.authentication ,mw.authorization, reviewController.updateReview)
router.delete("/books/:bookId/review/:reviewId",mw.authentication, mw.authorization, reviewController.deletedReview)

module.exports=router
