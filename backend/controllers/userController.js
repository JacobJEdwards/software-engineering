import jwt from 'jsonwebtoken';
import User from '../service/UserService.js';
export class UserController {
    static async getUser(req, res) {
        let id = await jwt.decode(req.headers.authorization, process.env.JWT_SECRET);
        if (id) {
           await User.getUserById(id.userId).then((user) => {
                delete user.password;
                res.status(200).json({user: user});
            }).catch((error) => {
                res.status(500).json({message: error.message});
            });
        }
    }
}
export default UserController;