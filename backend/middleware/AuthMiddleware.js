import jwt from 'jsonwebtoken';

class AuthMiddleware {
    static authenticate(req, res, next) {
        try {
            const token = req.headers.authorization;
            req.userData = jwt.verify(token, process.env.JWT_SECRET);
            next();
        } catch (e) {
            return res.status(401).json({message: 'Authentication failed'})
        }
    }
}


export default AuthMiddleware;
