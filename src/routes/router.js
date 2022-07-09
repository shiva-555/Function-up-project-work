const express=require("express")
const router=express.Router()
// const moment = require("moment")
const userController=require("../controller/userController")
const bookController=require("../controller/bookController")
const reviewController=require("../controller/reviewController")
const mw =require("../middleware/middlewareController")




router.post("/register",userController.createUser)
router.post("/login",userController.createLogin)
router.post("/books", mw.authentication,mw.authentication, bookController.createBook)
router.get("/books", mw.authentication ,bookController.getBook)
// router.get("/books/:bookId", bookController.getBookById)
router.put("/books/:bookId",mw.authentication,mw.authorization, bookController.updateBookById)
router.delete("/books/:bookId",mw.authentication, mw.authentication, bookController.deletedBook)

// ************REVIWS API*******************************

router.post("/books/:bookId/review", reviewController.createReview)
router.put("/books/:bookId/review/:reviewId", reviewController.updateReview)
router.delete("/books/:bookId/review/:reviewId", reviewController.deletedReview)

module.exports=router
