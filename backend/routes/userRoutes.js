const express = require('express');
const UserController = require('../controllers/userController');
class UserRoutes {
    constructor() {
        this.router = express.Router();
        this.registerRoutes();
    }

    registerRoutes() {
        this.router.get('/', UserController.getAllUsers);
    }
}


module.exports = new UserRoutes().router;