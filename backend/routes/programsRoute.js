const express = require("express");
const programsRouter = express.Router();
const programsService = require("../services/programService.js");
const authMiddleware = require("../middleware/authMiddleware.js");
const isAdmin = require("../middleware/isAdmin.js");


programsRouter.get("/", async (req,res)=>{
    try{
        const programs = await programsService.getAllPrograms();
        res.json(programs);
    }
    catch(err){
        console.log(err);
        res.sendStatus(500);
    }
});

programsRouter.get("/my-ratings", authMiddleware, async (req, res) => {
    try {
        const ratings = await programsService.getUserRatings(req.user.id);
        res.json(ratings);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

programsRouter.get("/:id", async (req,res) => {
    //mozda kasnije samo arraylength > 0 da vidim je li nasao
    try{
        const program = await programsService.getSingleProgram(req.params.id);
        res.json(program);
    }
    catch(err){
        console.log(err);
        res.sendStatus(500);
    }
})

programsRouter.post("/", authMiddleware, isAdmin, async (req,res)=>{
 
   let {title, description, difficulty, createdBy} = req.body;

   let isComplete = title && description && difficulty && createdBy;

   if(!isComplete){
    return res.status(400).json({message:"missing attributes for programs"});
   }

   try{
        const result = await programsService.createProgram(title, description, difficulty, createdBy, new Date());
        res.json(result);
   }

   catch(err){
        console.log(err);
        res.sendStatus(500);
   }
})

programsRouter.delete("/:id", authMiddleware, isAdmin, async (req,res) => {
    //mozda kasnije samo arraylength > 0 da vidim je li nasao 
    try{
        const result = await programsService.deleteProgram(req.params.id);
        if(result.affectedRows != 0){
           return res.json({message: `program deleted`});
        }
        return res.status(404).json({message: `Program not found`});
    }
    catch(err){
        console.log(err);
        res.sendStatus(500);
    }
})

programsRouter.put("/:id", authMiddleware, isAdmin, async (req, res) => {

    const { title, description, difficulty } = req.body;
    try{
        let result =
            await programsService.editProgram(
                title,
                description,
                difficulty, 
                req.params.id
            );
        if(result.affectedRows === 0){

            return res.status(404).json({
                message: "Program not found"
            });
        }
        res.json({
            message: "Program updated"
        });
    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
});

programsRouter.post("/:id/rate", authMiddleware, async (req, res) => {
    const rating = parseInt(req.body.rating);
    if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }
    try {
        await programsService.rateProgram(req.params.id, req.user.id, rating);
        res.json({ message: "Rating saved" });
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

module.exports = programsRouter;