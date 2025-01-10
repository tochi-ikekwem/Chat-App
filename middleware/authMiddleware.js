const jwt = require('jsonwebtoken');  
require('dotenv').config();  

const authMiddleware = (req, res, next) => {  
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];  

    if (!token) {  
        return res.status(401).json({ message: 'Auth token is required' });  
    }  

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {  
        if (err) {  
            if (err.name === 'TokenExpiredError') {  
                return res.status(401).json({ message: 'Token has expired, please log in again' });  
            }  
            return res.status(403).json({ message: 'Invalid token' });  
        }  

        req.user = decoded; // Attach user data to the request  
        next();  
    });  
};  

module.exports = authMiddleware;