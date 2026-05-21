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

blogRoute.post("/", async (req,res)=>{
   let {title, pdfUrl, createdBy} = req.body;

   let isComplete = title && pdfUrl && createdBy

   if(!isComplete){
    return res.status(400).json({message:"missing attributes for blogs"});
   }

   try{
        const result = await blogService.createBlog(title,pdfUrl,createdBy);
        res.json(result);
   }

   catch(err){
        console.log(err);
        res.sendStatus(500);
   }
})

blogRoute.delete("/:id", async (req,res)=>{
    try{
        let result = await blogService.deleteBlog(req.params.id);
        if(result.affectedRows != 0){
            return res.status(204).json({message: "blog succesfully deleted"});
        }
            res.status(400).json({messge: "blog hasn't been found"});
    }
    catch(err){
        console.log(err);
        res.sendStatus(500);
    }
})

blogRoute.put("/id", async (req,res)=>{
    const {title, pdfUrl, createdBy} = req.body
    isComplete = title && pdfUrl && createdBy

    if(!isComplete){
        res.status(404).json({message: "missing some attributes for blogs"});
    }
    try{
        let result = blogService.editBlog(title,pdfUrl,createdBy);
        res.status(200).json({message:"Successfully edite blog"});
    }
    catch(err){
        console.log(err);
        res.sendStatus(500);
    }
})

module.exports = blogRoute;