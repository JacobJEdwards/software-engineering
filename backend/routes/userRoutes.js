import express from "express";
import {AuthController} from "../controllers/authController.js";
import User from "../models/User.js";

class UserRoutes {
    constructor() {
        this.router = express.Router();
        this.registerRoutes();
    }

    registerRoutes() {
        this.router.get('/home', (req, res) => {
            User.getAllUsers()
                .then(users => {
                    res.status(200).send(users);
                })
                .catch(error => {
                    res.status(500).send
        })});
    }
}
