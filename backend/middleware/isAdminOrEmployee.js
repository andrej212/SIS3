const isAdminOrEmplyee = (req, res, next) => {
    if(!req.user){
        return res.status(401).json({message: "not authenticated"})
    }
    if(req.user.role !== "admin" && req.user.role !== "employee"){
        return res.status(403).json({message: "only admin and employee"})
    }
    next();
}


module.exports = isAdminOrEmplyee;