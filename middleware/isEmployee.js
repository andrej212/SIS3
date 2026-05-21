const iSEmployee = (req,res,next) => {
    if(!req.user){
        return res.status(401).json({messsage: "not authenticated"})
    }

    if(req.user.role !== "employee"){
        return res.status(403).json({message: "employee only"});
    }
    next();
};


module.exports = iSEmployee;