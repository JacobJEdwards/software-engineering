import bcrypt from "bcryptjs";
import userSchema from "../models/User.js";
import {model} from "mongoose";

class MilestoneService {

 async static addMilestone(moduleId, milestone) {
     const module = await this.findById(moduleId);
     module.milestones.push(milestone);
     await module.save();
 }
}

export default MilestoneService;
