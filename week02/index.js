//const http=require("http")
import http from "http"
import from fs
const app = http.createServer((req, res) => {
    if (req.url === '/') {
        res.end('Welcome to the server')}

        else if (req.url === '/about'){res.end('welcome to about us');
    }
})

const PORT = 8000
app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`)
})

