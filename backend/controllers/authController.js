const prisma = require("../config/prismaConfig");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) return res.status(404).json({ error: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: "Incorrect password" });

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.SECRET_KEY,
            { expiresIn: "1h" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "Strict"
        });

        res.json({ message: "Login Successful" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.register = async (req, res) => {
    const { email, password } = req.body
    try {
        const existingUser = await prisma.User.findUnique({
            where: {
                email: email
            }
        })
        if (existingUser) return res.json({ error: "User already exists" })
        const hashedPassword = await bcrypt.hash(password, 10)
        await prisma.user.create({
            data: {
                email: email,
                password: hashedPassword
            }
        })

        res.status(201).json({ message: "Successfully registered. Please log in." })

    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Internal server error" })
    }
}


exports.logout = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: true,
            sameSite: "Strict"
        });

        res.json({ message: "Logout successful" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};