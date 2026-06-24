const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const programsRoute = require("./routes/programsRoute.js");
const blogRoute = require("./routes/blogRoute.js");
const authRoute = require("./routes/authRoute.js");

const port = process.env.PORT || 5000;

const db = require("./db/connection.js");

app.use(express.json());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:5173");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    if (req.method === "OPTIONS") {
        return res.sendStatus(204);
    }
    next();
});

app.get("/", (req, res) => {
    res.send("this is some text that should be a file");
});

//routes
app.use("/programs", programsRoute);
app.use("/blogs", blogRoute);
app.use("/auth", authRoute);

app.listen(port ,()=>{
    console.log("server runnning on port:"+ port);
});