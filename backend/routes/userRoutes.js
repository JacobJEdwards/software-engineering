import express from "express";
import {AuthController} from "../controllers/authController.js";

class AuthRoutes {
    constructor() {
        this.router = express.Router();
        this.registerRoutes();
    }

    registerRoutes() {
        this.router.get('/home', (req, res) => {
            res.json({test: "homepage"})
        });
        this.router.get('/tasks', (req, res))
    }
}
