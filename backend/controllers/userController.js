import jwt from 'jsonwebtoken';
import User from '../service/UserService.js';

export class UserController {
    static async getUser(req, res) {
        let header = jwt.decode(req.headers.authorization, process.env.JWT_SECRET);
        if (header) {
            let response = await User.getUserById(header.userId);
            return res.status(response.code).json({message: response.message, data: response.data});
        } else {
            return res.status(401).json({message: "Unauthorized"});
        }
    }

    static async updateCurrentSemester(req, res) {
        let header = jwt.decode(req.headers.authorization, process.env.JWT_SECRET);
        if (req.body.currentSemester) {
            let response = await User.addCurrentSemester(header.userId, req.body.currentSemester);
            return res.status(response.code).json({message: response.message});
        } else {
            return res.status(400).json({message: "Please provide current semester"});
        }
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


export default UserController;