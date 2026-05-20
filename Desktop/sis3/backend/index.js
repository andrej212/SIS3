const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const programs = require("./routes/programsRoute.js");

const port = process.env.PORT || 5000;

const db = require("./db/connection.js");


app.get("/",(req,res)=>{
    res.send("this is some text that should be a file");
});

//routes
app.use("/programs",programs)

app.listen(port ,()=>{
    console.log("server runnning on port:"+ port);
});