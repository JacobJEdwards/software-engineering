import jwt from 'jsonwebtoken';
import User from '../service/UserService.js';

export class AuthController {
    static async signup(req, res) {
        const { email, name, password } = req.body;
        const response = await User.createUser(email, name, password);
        return res.status(response.code).json({ message: response.message, data: response.data });
    }

    static async login(req, res) {
        const { email, password } = req.body;
        const user = await User.authenticateUser(email, password);
        if (user.code !== 200) {
            return res.status(user.code).json({ message: user.message, data: user.data });
        }
        const token = jwt.sign({ userId: user.data._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return res.status(200).json({ token: token })
    }

    static async verify(req, res) {
        let id = req.query.userId;
        let verify = req.query.token;
        let user = await User.getUserInternal(id);
        if (user) {
            if (user.authCode === verify) {
                user.auth = true;
                await user.save();
                return res.status(200).json({message: "Validated"});
            }
        }
        return res.status(400).json({message: "invalid credentials"});
    }
}
