import express from 'express';
import ActivityController from '../controllers/ActivityController.js'

class ActivityRoutes {
    constructor() {
        this.router = express.Router();
        this.registerRoutes();
    }

    registerRoutes() {
        this.router.get('/activity', ActivityController.getActivity);
    }
}

export default ActivityRoutes;
