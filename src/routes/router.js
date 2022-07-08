const express=require("express")
const router=express.Router()
const userController=require("../controller/userController")
const bookController=require("../controller/bookController")
const reviewController=require("../controller/reviewController")

/******************************[USER API]**************************************************/
router.post("/register",userController.createUser)
router.post("/login",userController.createLogin)

/******************************[BOOK API]**************************************************/
router.post("/books",bookController.createBook)
router.get("/books",bookController.getBook)
router.get("/books/:bookId", bookController.getBookById)
router.put("/books/:bookId", bookController.updateBookById)
router.delete("/books/:bookId", bookController.deletedBook)

/******************************[REVIEW API]**************************************************/
router.post("/books/:bookId/review", reviewController.createReview)
router.put("/books/:bookId/review/:reviewId",reviewController.createReview)


module.exports=router
