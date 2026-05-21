const isAdmin = (req, res, next) => {

    // mora prvo proći authMiddleware
    if (!req.user) {
        return res.status(401).json({
            message: "not authenticated"
        });
    }

    // provjera role
    if (req.user.role !== "admin") {
        return res.status(403).json({
            message: "admin only"
        });
    }

    next();
};

module.exports = isAdmin;