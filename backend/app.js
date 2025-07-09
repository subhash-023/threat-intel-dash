const express = require("express")
const apiRouter = require("./routes/api")
const authRouter = require("./routes/auth")
const cors = require('cors')
const { authenticateToken } = require("./middleware/auth")
const app = express()
const cookieParser = require("cookie-parser");

app.use(cookieParser());
app.use(express.json())
app.use(express.urlencoded({extended : true}))

app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173',], credentials: true
}))

app.get("/", authenticateToken, (req, res) => {
    res.json(req.user)
})
app.use("/api", apiRouter)
app.use("/auth", authRouter)

app.listen(3000, () => {
    console.log("Server started listening on port 3000")
})