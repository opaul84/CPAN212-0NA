import express from "express";

const router = express.Router()

//checking if in route
router.get("/", (req, res)=>{
    res.send("Welcome to the lab router")
})
// Name route
router.get("/name", (req, res)=>{
    res.send("O'Shaine Paul")
})
// Greetings
router.get("/greeting", (req, res)=>{
    res.send("Hello From O'shaine, Student number n01717490")
})
// Add
router.get("/add/:x/:Y", (req, res)=>{
    let x=parseFloat(req.params.x)
    let y=parseFloat(req.params.y)
    res.send(`${(x+y)}`)
})
// Calculate
router.get("/calculate/:a/:b/:operation", (req, res)=>{
    let a=parseFloat(req.params.a)
    let b=parseFloat(req.params.b)
    let operation= req.params.operation
    let result = 0;
    switch (operation) {
        case "+":
            result = a+b;
            break;
        case "-":
            result = a-b;
            break
        case "*":
            result = a*b;
            break
        case "/":
            result = a/b;
            break
    
        default:
            res.send("invalid operator")
            break;
    }
    res.send(`${result}`)
})

export default router;

