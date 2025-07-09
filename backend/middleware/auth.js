const prisma = require("../config/prismaConfig")
const jwt = require("jsonwebtoken")
require("dotenv").config()

exports.authenticateToken = async (req, res, next) => {
    const token = req.cookies?.token

    if (!token) {
        return res.status(401).json({ error: "Token required" })
    }

    const secret_key = process.env.SECRET_KEY

    jwt.verify(token, secret_key, async (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: "Invalid Token" })
        }

        try {
            const user = await prisma.user.findUnique({
                where: {
                    id: decoded.id
                }
            })

            if (!user) {
                return res.status(404).json({ error: "User not found" })
            }

            req.user = user
            next()
        } catch (error) {
            console.error(error)
            return res.status(500).json({ error: "Internal server error" })
        }
    })
}