import express from 'express';
import TaskController from '../controllers/TaskController.js'

class TaskRoutes {
    constructor() {
        this.router = express.Router();
        this.registerRoutes();
    }

    registerRoutes() {
        this.router.get('/task', TaskController.getTasks);
        this.router.post('/task', TaskController.createTask);
        this.router.delete('/task', TaskController.deleteTask);
        this.router.put('/task', TaskController.updateTask);
    }
}

export default TaskRoutes;
