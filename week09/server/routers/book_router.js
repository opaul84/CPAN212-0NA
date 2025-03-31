import express from "express";
import Book from "../models/Book.js";

const router = express.Router();
//1-fetch all
router.get("/",(req,res)=>{
    //1-fetch from DB
    Book.find().then((results)=>{
        res.json(results);
    }); // ->DB.BOOK
});

//2-fetch by id
router.get("/:id",(req,res)=>{
    Book.findById(req.params.id).then((results)=>{
        res.json(results);
    });
});

//3-Search from DB
router.get("/search",(req,res)=>{
    const filters = {}

    //query
    if (req.query.title) {
        filters.title = req.query.title
    }
    if(req.query.pages) {
        let pages = parseInt(req.query.pages)
        if(req.query.logicalOperators)
        {switch (req.query.logicalOperators){
            case gte:
                filters.pages = {$gte: {pages}};
                break;
                default:
                    break;
        }}
        filters.pages = Number //Number
    }

    Book.find({}).then((results)=>{
        res.json(results);
    }); // ->DB.BOOK
});

//4-Update
router.put('/:id',(req, res)=>{
    Book.findByIdAndUpdate (req.params.id)
    .then(()=>{
    
    })
})
router.delete('/:id',(req, res)=>{
    Book.findByIdAndDelete(req.params.id)
    .then(()=>{
        res.json({message:""})
    
    })
})
router.post("/save", (req,res)=>{
    const {title, author, publisher} = req.body;
    let newBook = new Book({
        publisher,
        page: 500,
    })

    newBook.save().then(()=>{
        res.json({message:"datasaved"})
})
})


export default router;