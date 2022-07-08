const express=require("express")
const router=express.Router()
// const moment = require("moment")
const userController=require("../controller/userController")
const bookController=require("../controller/bookController")
const reviewController=require("../controller/reviewController")


router.post("/register",userController.createUser)
router.post("/login",userController.createLogin)
router.post("/books",bookController.createBook)
router.get("/books",bookController.getBook)
// router.get("/books/:bookId", bookController.getBookById)
router.put("/books/:bookId", bookController.updateBookById)
router.delete("/books/:bookId", bookController.deletedBook)
router.post("/books/:bookId/review", reviewController.createReview)


module.exports=router
