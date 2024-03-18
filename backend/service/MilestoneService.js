import bcrypt from "bcryptjs";
import userSchema from "../models/User.js";
import {model} from "mongoose";

class MilestoneService {
    static async createMilestone(moduleCode, milestoneName, milestoneType, milestoneStartDate, milestoneEndDate, ltsDefined, user) {
       let milestoneExists =  user.semester.find(semester => semester.modules.find(module => module.moduleCode === moduleCode));
        if (milestoneExists) {
            const newMilestone = {
                milestoneTitle: milestoneName,
                milestoneType: milestoneType,
                startDate: milestoneStartDate,
                endDate: milestoneEndDate,
                ltsDefined: ltsDefined
            };
            user.semester.find(semester => {
                semester.modules.find(module => {
                   if(module.moduleCode === moduleCode) {
                       module.milestones.push(newMilestone);
                   }
                })
            });

           await user.save();
        } else {
            console.log("Module does not exist");
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
