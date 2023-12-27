const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

const authenticate = (req, res, next) => {
    let token = req.headers.authorization;

    token = token ? token.split(' ')[1] : null;
    if (!token) {
        return res.status(401).json({
            code: 401,
            message: 'Unauthorized'
        });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded) {
            req.user = decoded;
            next();
        }
        else {
            return res.status(401).json({
                code: 401,
                message: 'Your token is expired'
            });
        }
    } catch (error) {
        return res.status(401).json({
            code: 401,
            message: 'Unauthorized'
        });
    }
}

module.exports = {
    authenticate
}