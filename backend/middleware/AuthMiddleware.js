import jwt from 'jsonwebtoken';
import User from '../service/UserService.js'

class AuthMiddleware {
    static async authenticate(req, res, next) {
        try {
            const token = req.headers.authorization;
            req.userData = jwt.verify(token, process.env.JWT_SECRET);
            let user = User.getUserInternal(req.userData.userId);
            if (!user.auth) return res.status(401).json({message: 'Authentication failed'});
            next();
        } catch (e) {
            return res.status(401).json({ message: 'Authentication failed' })
        }
    }
}


export default AuthMiddleware;
