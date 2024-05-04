import express from "express";
import ActivityController from "../controllers/ActivityController.js";

class ActivityRoutes {
  constructor() {
    this.router = express.Router();
    this.registerRoutes();
  }

  registerRoutes() {
    this.router.get("/activity", ActivityController.getActivity);
    this.router.post("/activity", ActivityController.createActivity);
    this.router.delete("/activity", ActivityController.deleteActivity);
    this.router.put("/activity", ActivityController.updateActivity);
  }
}

export default ActivityRoutes;
