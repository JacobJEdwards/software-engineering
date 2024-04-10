import express from 'express';
import TaskController from '../controllers/TaskController.js'

class TaskRoutes {
    constructor() {
        this.router = express.Router();
        this.registerRoutes();
    }

    registerRoutes() {
        this.router.get('/task', TaskController.getTasks);
    }
}

export default TaskRoutes;
