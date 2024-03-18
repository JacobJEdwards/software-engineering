import bcrypt from "bcryptjs";
import userSchema from "../models/User.js";
import {model} from "mongoose";

class MilestoneService {
    static async createMilestone(module, milestoneName, milestoneType, milestoneStartDate, milestoneEndDate) {

        const milestoneExists = module.milestones.some(milestone => milestone.milestoneName === milestoneName);
        if (!milestoneExists) {
            const newMilestone = {
                milestoneName: milestoneName,
                milestoneType: milestoneType,
                startDate: milestoneStartDate,
                endDate: milestoneEndDate
            };
            module.milestones.push(newMilestone);
            await module.save();
        } else {
            console.log("Milestone already exists");
        }
    }

    // YC -> can you add another read method that takes name as parameter

    static async readMilestone(module, milestoneId) {
        const milestone = module.milestones.find(milestone => milestone.id === milestoneId);
        if (milestone) {
            return milestone;
        } else {
            console.log("Milestone does not exist");
            return null;
        }
    }

    static async updateMilestone(module, milestoneId, newMilestoneName, newStartDate, newEndDate, milestoneType) {
        const milestone = module.milestones.find(milestone => milestone.id === milestoneId);
        if (milestone) {
            if (milestone.ltsDefined) {
                return false;
            }
            milestone.milestoneName = newMilestoneName;
            milestone.milestoneType = milestoneType;
            milestone.startDate = newStartDate;
            milestone.endDate = newEndDate
            console.log("Milestone updated successfully");
            await module.save();
        } else {
            console.log("Milestone does not exist");
        }
    }

    static async updateMilestoneName(module, milestoneName, newMilestoneName) {
        const milestone = module.milestones.find(milestone => milestone.milestoneName === milestoneName);
        if (milestone) {
            if (milestone.ltsDefined) {
                return false;
            }
            milestone.milestoneName = newMilestoneName;
            console.log("Milestone updated successfully");
            await module.save();
        } else {
            console.log("Milestone does not exist");
        }
    }

    static async updateMilestoneStartDate(module, milestoneId, newStartDate) {
        const milestone = module.milestones.find(milestone => milestone.milestoneId === milestoneId);
        if (milestone) {
            if (milestone.ltsDefined) {
                return false;
            }
            milestone.milestoneDate = newMilestoneDate;
            console.log("Milestone updated successfully");
            await module.save();
        } else {
            console.log("Milestone does not exist");
        }
    }


    static async deleteMilestone(module, milestoneName) {
        const milestone = module.milestones.find(milestone => milestone.milestoneName === milestoneName);
        if (milestone) {
            module.milestones.pull(milestone);
            console.log("Milestone deleted successfully");
            await module.save();
        } else {
            console.log("Milestone does not exist");
        }
    }
}


userSchema.loadClass(MilestoneService);
const Milestone = model('Milestone', userSchema);

export default Milestone;
