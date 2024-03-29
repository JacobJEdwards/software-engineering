import jwt from 'jsonwebtoken';
import User from '../service/UserService.js';
export class UserController {
    static async getUser(req, res) {
        let id = jwt.decode(req.headers.authorization, process.env.JWT_SECRET);
        if (id) {
            let response = await User.getUserById(id);
            return res.status(response.status).json({ message: response.message, data: response.data });
        } else {
            return res.status(401).json({ message: "Unauthorized" });
        }
    }
}
export default UserController;
