const express = require("express");
const authRouter = express.Router();
const authService = require("../services/authService.js")
const jwt = require("jsonwebtoken");

// REGISTER
authRouter.post("/register", async (req, res) => {

    const { username, email, password } = req.body;
    const isComplete = username && email && password

    if (!isComplete){
        return res.status(400).json({
            message: "missing fields"
        });
    }
    try{
        const result =await authService.createUser(username, email, password);
        res.status(201).json({
            message: "user created",
            userId: result.insertId
        });
    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
});


// LOGIN 
authRouter.post("/login", async (req, res) => {

    const { username, password } = req.body;

    const isComplete = username && password;

    if (!isComplete) {
        return res.status(400).json({
            message: "missing fields"
        });
    }

    try {

        const users = await authService.getUserByUsername(username);

        if (users.length === 0) {
            return res.status(404).json({
                message: "user not found"
            });
        }

        const user = users[0];

        if (user.password !== password) {
            return res.status(401).json({
                message: "wrong password"
            });
        }

        // 🔥 JWT TOKEN
        const token = jwt.sign(
            {
                id: user.id,
                username: user.username,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({
            message: "login success",
            token
        });

    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

module.exports = authRouter;
