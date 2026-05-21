const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const programsRoute = require("./routes/programsRoute.js");
const blogRoute = require("./routes/blogRoute.js");
const authRoute = require("./routes/authRoute.js");

const port = process.env.PORT || 5000;

const db = require("./db/connection.js");


app.get("/",(req,res)=>{
    res.send("this is some text that should be a file");
});

//routes
app.use("/programs",programsRoute);
app.use("/blogs",blogRoute);
app.use("/auth", authRoute);

app.listen(port ,()=>{
    console.log("server runnning on port:"+ port);
});