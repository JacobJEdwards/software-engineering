import express from 'express';
import ImportController from '../controllers/TaskController.js';
class ImportRoutes {
    constructor() {
        this.router = express.Router();
        this.registerRoutes();
    }

    registerRoutes() {
        this.router.get('/task', taskController.getTasks);
    }
}


export default ImportRoutes;
