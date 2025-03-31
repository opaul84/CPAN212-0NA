import express from "express";
import User from "../models/user.js";
import bcrypt from "bcryptjs";


const router = express.Router();

//1-Register
router.post("/register", (req,res)=>{
    const {email, password} = req.body;

    bcrypt.hash(password, 10)
    .then((hashedPassword)=>{
        let newUser = new User({email,
            password: hashedPassword,});

        newUser.save().then(()=>{
            res.json({message:"new user added"})
        })
    });
});

router.post("/login", (req, res)=>{
    const {email, password} = req.body;

    User.findOne({email: email})
    .then((userAccount)=>{
        if(!userAccount) {
          return res.status(400).json({message: "NO ACCOUNT FOUND"})
        }
        bcrypt.compare(password, userAccount.password)
        .then((compareResults)=>{
            if (compareResults) {
            return res.json({message: "YOU HAVE LOGGED IN"});
            }
        });
    })
    .catch((err)=>{
        console.log(err);
        res.json({message: "Account not found"});
    });
});

export default router;

/*
1-regisger
    1.1 parse info
    1.2 hash the password
    1.3 save
2 login
*/