
class UserController {
    async getAllUsers(req, res) {
        try {
            res.json({"Jamie": "is cool"});
        } catch (error) {
            res.status(500).send(error);
        }
    }
}

module.exports = new UserController(); // Export an instance
