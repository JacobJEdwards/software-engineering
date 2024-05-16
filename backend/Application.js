import express from "express";
import cors from "cors";
import AuthMiddleware from "./middleware/AuthMiddleware.js";
import AuthRoutes from "./routes/AuthRoutes.js";
import Logger from "./middleware/Logger.js";
import compression from "compression";
import mongoose from "mongoose";
import ImportRoutes from "./routes/ImportRoutes.js";
import CronJob from "./utils/CronJobSetup.js";
import UserRoutes from "./routes/userRoutes.js";
import TaskRoutes from "./routes/TaskRoutes.js";
import ActivityRoutes from "./routes/ActivityRoutes.js";
import Mailer from "./middleware/Mailer.js";
import MilestoneRoutes from "./routes/MilestoneRoutes.js";

class Application {
  constructor(port, uri) {
    this.app = express();
    this.app.use(express.json());
    this.app.use(cors());
    this.app.use(Logger);
    this.app.use(compression());
    this.cronJob = new CronJob();
    this.authRoutes = new AuthRoutes();
    this.importRoutes = new ImportRoutes();
    this.userRoutes = new UserRoutes();
    this.taskRoutes = new TaskRoutes();
    this.activityRoutes = new ActivityRoutes();
    this.milestoneRoutes = new MilestoneRoutes();
    this.PORT = port;
    this.mongoDBUri = uri;
  }
  start() {
    this.cronJob.startAllJobs();
    this.app.use("/api/auth", this.authRoutes.router);
    this.app.use("/api/protected", AuthMiddleware.authenticate, this.authRoutes.router);
    this.app.use("/api/protected", AuthMiddleware.authenticate, this.importRoutes.router);
    this.app.use("/api/protected", AuthMiddleware.authenticate, this.userRoutes.router);
    this.app.use("/api/protected", AuthMiddleware.authenticate, this.taskRoutes.router);
    this.app.use("/api/protected", AuthMiddleware.authenticate, this.activityRoutes.router);
    this.app.use("/api/protected", AuthMiddleware.authenticate, this.milestoneRoutes.router);
    Mailer.upcomingTasks();
    mongoose
      .connect(this.mongoDBUri)
      .then(() => console.log("MongoDB connected"))
      .catch((err) => console.error("MongoDB connection error:", err));
    this.app.listen(this.PORT, () => {
      console.log("Server is running on port: " + this.PORT);
    });
  }
}

export default Application;
