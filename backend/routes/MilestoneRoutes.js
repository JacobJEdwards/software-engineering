import express from "express";
import MilestoneController from "../controllers/MilestoneController.js";

class MilestoneRoutes {
  constructor() {
    this.router = express.Router();
    this.registerRoutes();
  }

  registerRoutes() {
    this.router.get("/milestone", MilestoneController.getMilestones);
    this.router.post("/milestone", MilestoneController.createMilestone);
    this.router.delete("/milestone", MilestoneController.deleteMilestone);
    this.router.put("/milestone", MilestoneController.updateMilestone);
  }
}

export default MilestoneRoutes;
