import express from 'express';
import { AuthController } from '../controllers/authController.js';
import UserController from "../controllers/userController.js";

class AuthRoutes {
    constructor() {
        this.router = express.Router();
        this.registerRoutes();
    }

    registerRoutes() {
        this.router.post('/signup', AuthController.signup);
        this.router.post('/login', AuthController.login);
        this.router.get('/verify', AuthController.verify);
    }
}


export default AuthRoutes;
