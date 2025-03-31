//imports
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
//import Book from './models/Book.js' // db.books not needed since we import the router now
import book_router from "./routers/book_router.js"
import user_router from "./routers/user_router.js"

//variables
dotenv.config()
const app = express();
const PORT = process.env.PORT || 6000;

//middleware
app.use(cors());
app.use(express.json());// JSON
app.use(express.urlencoded({extended: true})); //html forms

//notes

//start up
mongoose.connect(process.env.MONGODB_URL)
.then(()=>{
    console.log("DB is Connected");
    app.listen(PORT,()=>{
        console.log(`http://localhost:${PORT}`);
    });
});

//routes
app.use('/book', book_router)
app.use('/user', user_router)