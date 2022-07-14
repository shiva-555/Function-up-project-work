const express=require('express')
const bodyParser=require('body-parser')
const route=require('./routes/router')
const{default:mongoose} =require("mongoose")
const { Router } = require('express')
const app=express()


const multer= require("multer");
const { AppConfig } = require('aws-sdk');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))
app.use( multer().any())
 mongoose.connect("mongodb+srv://shilpikumari:shilpi1234@cluster0.phpas.mongodb.net/group-72-Database",{
    useNewUrlParser:true
 })

 .then(()=>console.log("mongoDb is conncted"))
 .catch(err=>console.log(err))

 app.use('/',route)

 app.listen(process.env.PORT || 3000,function(){
    console.log("express app running on port"+ (process.env.PORT || 3000))
 })

