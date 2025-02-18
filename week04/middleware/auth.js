const auth =(req,res,next) =>{
    if (req.query.username == "oshaine") {
        next();
    } else {
        res.send("you are not authorized for this page")
    }
}

export default auth;