const express = require("express");
const blogRoute = express.Router();
const blogService = require("../services/blogService.js");


blogRoute.get("/", async (req,res)=>{
    try{
        let results = await blogService.getAllBlogs();
        res.json(results);
    }
    catch(err){
        console.log("blog err:",err);
        res.sendStatus(500);
    }
})

blogRoute.get("/:id", async (req,res) => {
    try{
        let result = await blogService.getOneBlog(req.params.id);
        res.json(result);
    }
    catch(err){
        console.log(err);
        res.sendStatus(err);
    }
})

module.exports = blogRoute;