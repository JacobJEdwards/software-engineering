import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export class AuthController {
    static async signup(req, res) {
        try {
            console.log(req.json)
            const { email, name, password } = req.body;
            const user = await User.createUser(email, name, password);
            return res.status(201).json({ message: 'User created!', userId: user._id });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    static async login(req, res) {
        try {
            const { email, password } = req.body;
            const user = await User.authenticateUser(email, password);
            if (!user) {
                return res.status(401).json({ message: 'Authentication failed' });
            }

            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.status(200).json({ token });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}
