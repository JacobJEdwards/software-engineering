import bcrypt from "bcryptjs";
import userSchema from "../models/User.js";
import {model} from "mongoose";

class MilestoneService {
     static addMilestone(module, milestoneData) {
         module.milestones.push(milestoneData);
     }
}

export default MilestoneService;
