import User from '../models/userModel.js';
class UserController {
    async getAllUsers(req, res) {
        try {
            const users = await User.getAllUsers()
            res.status(200).send(users);
        } catch (error) {
            res.status(500).send(error);
        }
    }

}
export default UserController;