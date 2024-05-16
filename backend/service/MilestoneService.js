import userSchema from "../models/User.js";
import Response from "../utils/Response.js";
import User from "../service/UserService.js";
import {model} from "mongoose";
import Validator from "../middleware/Validator.js";

class MilestoneService {
    static async createMilestoneByUserId(userid, moduleCode, milestoneName, milestoneType, milestoneStartDate, milestoneEndDate, ltsDefined) {
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

            let response = await Validator.validateMilestone(newMilestone);
            if (response.code !== 200) return response;

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
            return new Response("Milestone could not find milestone", 404, {
                userid: userid, milestoneName: milestoneName
            });
        }
    }

    static async createMilestoneByUser(user, moduleCode, milestoneName, milestoneType, milestoneStartDate, milestoneEndDate, ltsDefined) {
        let milestoneExists = user.semester.find(semester => semester.modules.find(module => module.moduleCode === moduleCode));
        if (milestoneExists) {
            const newMilestone = {
                milestoneTitle: milestoneName,
                milestoneType: milestoneType,
                startDate: milestoneStartDate,
                endDate: milestoneEndDate,
                ltsDefined: ltsDefined
            };
            let response = await Validator.validateMilestone(newMilestone);
            if (response.code !== 200) return response;
            user.semester.find(semester => {
                semester.modules.find(module => {
                    if (module.moduleCode === moduleCode) {
                        module.milestones.push(newMilestone);
                    }
                })
            });
            return new Response("Milestone successfully created", 200, {});
        } else {
            return new Response("Cannot find milestone", 400, {
                userid: user.id, milestoneName: milestoneName, moduleCode: moduleCode
            });
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


    static async updateMilestone(user, moduleCode, milestoneName, newMilestoneName, newStartDate, newEndDate, milestoneType) {
        const mod = user.module.find((module) => {
            if (module.name === moduleName) return module;
        });

        if (mod === null) return new Response("Module does not exist", 404, {});
        let milestone = mod.milestones.find((milestone) => {
            if (milestone.milestoneName === milestoneName) {
                return milestone;
            }
        })

        if (milestone && !milestone.ltsDefined) {
            milestone.milestoneName = newMilestoneName == null ? milestone.milestoneName : newMilestoneName
            milestone.milestoneType = milestoneType == null ? milestone.milestoneType : milestoneType
            milestone.startDate = newStartDate == null ? milestone.startDate : newStartDate
            milestone.endDate = newEndDate == null ? milestone.endDate : newEndDate;
            return await Validator.validateMilestone(milestone);
        } else {
            return new Response("Milestone not able to be updated", 400, {});
        }
    }


    static async readMilestoneByModuleId(userId, moduleId) {
        const user = await User.getUserInternal(userId);
        if (!user) {
            return new Response("User does not exist", 404, {userId});
        }
        const response = await Module.readModuleByUser(user, moduleId);
        if (response.status !== 200) {
            return response;
        }
        return new Response("Tasks found", 200, response.message.milestones);
    }
    static async updateMilestoneByUserId(userId, milestoneId, newMilestoneName, newStartDate, newEndDate, milestoneType) {
        const user = await User.getUserInternal(userId);
        const milestone = user.module.find(module => module.milestones.find(milestone => milestone.id === milestoneId));
        if (milestone && !milestone.ltsDefined) {
            milestone.milestoneName = newMilestoneName == null ? milestone.milestoneName : newMilestoneName
            milestone.milestoneType = milestoneType == null ? milestone.milestoneType : milestoneType
            milestone.startDate = newStartDate == null ? milestone.startDate : newStartDate
            milestone.endDate = newEndDate == null ? milestone.endDate : newEndDate;
            let response = await Validator.validateMilestone(milestone);
            if (response.code !== 200) return response;
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

    static deleteMilestoneByUser(user, moduleCode, milestoneTitle) {
        user.semester.forEach(semester => {
            semester.modules.find(module => {
                if (module.moduleCode == moduleCode) {
                    module.milestones.find(milestone => {
                        if (milestone.milestoneTitle === milestoneTitle) {
                            module.milestones.pull(milestone);
                            return new Response("Milestone deleted successfully", 200, {});
                        }
                    })
                }
            })
        });
        return new Response("Milestone does not exist", 400, {});
    }


    static async milestoneFromToDate(userId, fromDate, toDate) {
        let user = await User.getUserInternal(userId);
        if (!user) {
            return new Response("User does not exist", 404, {userId});
        } else if (fromDate > toDate) {
            return new Response("Invalid date range", 400, {fromDate, toDate});
        }
        let milestones = user.semester.flatMap((sem) => sem.modules.flatMap((mod) => mod.milestones.filter((mil) => mil.endDate >= fromDate && mil.endDate <= toDate)));
        return new Response("Tasks found", 200, milestones);
    }


    static async milestoneFromDate(userId, date) {
        const response = await Validator.validateUser(userId, null, null, null, null);
        if (response.code !== 200) {
            return response;
        }
        let user = await User.getUserInternal(userId);
        if (!user) {
            return new Response("User does not exist", 404, {userId});
        } else if (date < new Date()) {
            return new Response("Invalid date", 400, {date});
        }
        let milestones = user.semester.flatMap((sem) => sem.modules.flatMap((mod) => mod.milestones.filter((mil) => mil.startDate >= date)));
        return new Response("Tasks found", 200, milestones);
    }

}


userSchema.loadClass(MilestoneService);
const Milestone = model('Milestone', userSchema);

export default Milestone;
