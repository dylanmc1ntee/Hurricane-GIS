// middleware/authMiddleware.js

const jwt = require('jsonwebtoken');


// JWT secret from environment variables
const JWT_SECRET = '1c44aadf4f81ceb5e14d5c6bf219bb884ac086a52f190e1534a04c37e95e98a5';

function authMiddleware(req, res, next) {
    // Get the token from the Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: 'Authorization token missing' });
    }

    // Extract the token from the header (format: 'Bearer <token>')
    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Invalid token format' });
    }

    try {
        // Verify the token using the JWT secret
        const decoded = jwt.verify(token, JWT_SECRET);

        // Attach the decoded user information to the request object
        req.user = decoded;

        // Proceed to the next middleware or route handler
        next();
    } catch (err) {
        // If verification fails, return an error
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
}

module.exports = authMiddleware;
