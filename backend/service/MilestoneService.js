import bcrypt from "bcryptjs";
import userSchema from "../models/User.js";
import {model} from "mongoose";

class MilestoneService {
    static async createMilestone(module, milestoneName, milestoneDescription, milestoneDate) {

        const milestoneExists = module.milestones.some(milestone => milestone.milestoneName === milestoneName);
        if (!milestoneExists) {
            const newMilestone = {
                milestoneName: milestoneName,
                milestoneDescription: milestoneDescription,
                milestoneDate: milestoneDate
            };
            module.milestones.push(newMilestone);
            await module.save();
        } else {
            console.log("Milestone already exists");
        }
    }


    static async readMilestone(module, milestoneId) {
        const milestone = module.milestones.find(milestone => milestone.id === milestoneId);
        if (milestone) {
            return milestone;
        } else {
            console.log("Milestone does not exist");
            return null;
        }
    }

    static async updateMilestone(module, milestoneId, newMilestoneName, newMilestoneDescription, newMilestoneDate) {
        const milestone = module.milestones.find(milestone => milestone.id === milestoneId);
        if (milestone) {
            milestone.milestoneName = newMilestoneName;
            milestone.milestoneDescription = newMilestoneDescription;
            milestone.deadline = newMilestoneDate;
            console.log("Milestone updated successfully");
            await module.save();
        } else {
            console.log("Milestone does not exist");
        }
    }

    static async updateMilestoneName(module, milestoneName, newMilestoneName) {
        const milestone = module.milestones.find(milestone => milestone.milestoneName === milestoneName);
        if (milestone) {
            milestone.milestoneName = newMilestoneName;
            console.log("Milestone updated successfully");
            await module.save();
        } else {
            console.log("Milestone does not exist");
        }
    }

    static async updateMilestoneDescription(module, milestoneName, newMilestoneDescription) {
        const milestone = module.milestones.find(milestone => milestone.milestoneName === milestoneName);
        if (milestone) {
            milestone.milestoneDescription = newMilestoneDescription;
            console.log("Milestone updated successfully");
            await module.save();
        } else {
            console.log("Milestone does not exist");
        }
    }

    static async updateMilestoneDate(module, milestoneId, newMilestoneDate) {
        const milestone = module.milestones.find(milestone => milestone.milestoneId === milestoneId);
        if (milestone) {
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
