const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            message: "no token provided"
        });
    }

    // format: "Bearer TOKEN"
    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            message: "invalid token format"
        });
    }

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        //  dodaj usera u request
        req.user = decoded;

        next();

    } catch (err) {

        return res.status(403).json({
            message: "invalid or expired token"
        });
    }
};

module.exports = authMiddleware;