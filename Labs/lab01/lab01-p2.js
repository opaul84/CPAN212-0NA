/*
home page
about us
contact
login 
register
details
search page
*/

import http from "http"
import fs from "fs"
import path from "path"
const app = http.createServer((req, res)=>{
    if(req.url === "/"){
        res.end("welcome to the server")
    }
    else if(req.url === "/about"){
        const webpage = fs.readFileSync(path.join( "about.html"))
        res.end (``)
    }
    else {
        res.end("page not found")
    }
});
const PORT = process.env.PORT || 8000;

app.listen(PORT, ()=>{
    console.log(`http://localhost:${PORT}`)
})



