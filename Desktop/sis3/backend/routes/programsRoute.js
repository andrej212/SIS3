const express = require("express");
const programsRoute = express.Router();


programsRoute.get("/", (req,res)=>{
    console.log("we are at programs route");
    res.json({message: "hi hi hi" })
});


module.exports = programsRoute;