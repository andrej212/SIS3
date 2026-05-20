const express = require("express");
const programsRouter = express.Router();
const programsService = require("../services/programService.js");


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

programsRouter.get("/:id", async (req,res) => {
    try{
        const program = await programsService.getSingleProgram(req.params.id);
        res.json(program);
    }
    catch{
        console.log(err);
        res.sendStatus(500);
    }
})

module.exports = programsRouter;