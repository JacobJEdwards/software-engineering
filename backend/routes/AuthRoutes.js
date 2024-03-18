import express from 'express';
import { AuthController } from '../controllers/AuthController.js';

class AuthRoutes {
    constructor() {
        this.router = express.Router();
        this.registerRoutes();
    }

    registerRoutes() {
        this.router.post('/signup', AuthController.signup);
        this.router.post('/login', AuthController.login);
    }
}


export default AuthRoutes;
