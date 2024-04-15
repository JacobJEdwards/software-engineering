import userSchema from "../models/User.js";
import Response from "../utils/Response.js";
import User from "../service/UserService.js";
import { model } from "mongoose";

class MilestoneService {
    static async createMilestone(userid, moduleCode, milestoneName, milestoneType, milestoneStartDate, milestoneEndDate, ltsDefined) {
        let user = await User.getUserInternal(userid);
        let milestoneExists = user.semester.find(semester => semester.modules.find(module => module.moduleCode === moduleCode));
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
                    if (module.moduleCode === moduleCode) {
                        module.milestones.push(newMilestone);
                    }
                })
            });

            await user.save();
            return new Response("Milestone created successfully", 200, {});
        } else {
            return new Response("Milestone could not find milestone", 404, { userid: userid, milestoneName: milestoneName });
        }
    }

    static createMilestone(user, moduleCode, milestoneName, milestoneType, milestoneStartDate, milestoneEndDate, ltsDefined) {
        let milestoneExists = user.semester.find(semester => semester.modules.find(module => module.moduleCode === moduleCode));
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
                    if (module.moduleCode === moduleCode) {
                        module.milestones.push(newMilestone);
                    }
                })
            });
            return new Response("Milestone successfully created", 200, {});
        } else {
            return new Response("Cannot find milestone", 400, { userid: user.id, milestoneName: milestoneName, moduleCode: moduleCode });
        }
    }

    static readMilestone(module, milestoneId) {
        const milestone = module.milestones.find(milestone => milestone.id === milestoneId);
        if (milestone) {
            return new Response("Milestone found", 200, milestone);
        } else {
            return new Response("Milestone not found", 400, {});
        }
    }

    static readMilestoneByUser(user, milestoneId) {
        const milestone = user.semester.flatMap(semester => semester.modules.flatMap(module => module.milestones.find(milestone => milestone.id === milestoneId)));
        if (milestone) {
            return new Response("Milestone found", 200, milestone);
        } else {
            return new Response("Milestone does not exist", 404, {});
        }
    }



    static async readMilestoneByUserId(userId, milestoneId) {
        const user = await User.getUserInternal(userId);
        const milestone = user.module.find(module => module.milestones.find(milestone => milestone.id === milestoneId));
        if (milestone) {
            return new Response("Milestone found", 200, milestone);
        } else {
            return new Response("Milestone does not exist", 404, {});
        }
    }


    static updateMilestone(user, milestoneId, newMilestoneName, newStartDate, newEndDate, milestoneType) {
        const milestone = user.module.find(module => module.milestones.find(milestone => milestone.id === milestoneId));
        if (milestone && !milestone.ltsDefined) {
            milestone.milestoneName = newMilestoneName == null ? milestone.milestoneName : newMilestoneName
            milestone.milestoneType = milestoneType == null ? milestone.milestoneType : milestoneType
            milestone.startDate = newStartDate == null ? milestone.startDate : newStartDate
            milestone.endDate = newEndDate == null ? milestone.endDate : newEndDate;
            return new Response("Milestone updated successfully", 200, {});
        } else {
            return new Response("Milestone not able to be updated", 400, {});
        }
    }


    static async updateMilestoneByUserId(userId, milestoneId, newMilestoneName, newStartDate, newEndDate, milestoneType) {
        const user = await User.getUserInternal(userId);
        const milestone = user.module.find(module => module.milestones.find(milestone => milestone.id === milestoneId));
        if (milestone && !milestone.ltsDefined) {
            milestone.milestoneName = newMilestoneName == null ? milestone.milestoneName : newMilestoneName
            milestone.milestoneType = milestoneType == null ? milestone.milestoneType : milestoneType
            milestone.startDate = newStartDate == null ? milestone.startDate : newStartDate
            milestone.endDate = newEndDate == null ? milestone.endDate : newEndDate;
            await user.save();
            return new Response("Milestone updated successfully", 200, {});
        } else {
            return new Response("Could not updated Milestone", 400, {});
        }
    }


    static deleteMilestone(module, milestoneName) {
        const milestone = module.milestones.find(milestone => milestone.milestoneName === milestoneName);
        if (milestone) {
            module.milestones.pull(milestone);
            return new Response("Milestone deleted successfully", 200, {});
        } else {
            return new Response("Milestone not found", 404, {});
        }
    }


    static async deleteMilestoneByUserId(userId, milestoneId) {
        const user = await User.getUserInternal(userId);
        const milestone = user.module.find(module => module.milestones.find(milestone => milestone.id === milestoneId));
        if (milestone) {
            module.milestones.pull(milestone);
            await user.save();
            return new Response("Milestone deleted successfully", 200, {});
        } else {
            return new Response("Milestone not found", 404, {});
        }
    }
}


userSchema.loadClass(MilestoneService);
const Milestone = model('Milestone', userSchema);

export default Milestone;
