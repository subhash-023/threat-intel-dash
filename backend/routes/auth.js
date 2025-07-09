const express = require("express")
const { login, register, logout } = require("../controllers/authController")
const { authenticateToken } = require("../middleware/auth")
const authRouter = express.Router()

authRouter.post('/login', login)
authRouter.post('/register', register)
authRouter.post('/logout', logout)
authRouter.get('/verify-token', authenticateToken, async (req, res) => {
    await new Promise((resolve) => setTimeout(resolve, 100))
    res.json(req.user)
})

module.exports = authRouter