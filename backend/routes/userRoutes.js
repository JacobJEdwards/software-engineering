import express from "express";
import UserController from "../controllers/userController.js";

export class UserRoutes {
    constructor() {
        this.router = express.Router();
        this.registerRoutes();
    }

    registerRoutes() {
        this.router.get('/home', UserController.getUser);
        this.router.post('/current-semester', UserController.updateCurrentSemester)
    }
}



export default UserRoutes;
