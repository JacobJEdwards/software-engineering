
import activitySchema from "../models/Activity.js";
import Response from "../utils/Response.js";
import User from "../service/UserService.js";
import Task from "../service/TaskService.js";
import { model } from "mongoose";
import Validator from "../middleware/Validator.js";

class ActivityService {
    static async createActivity(userId, tasks, activityName, activityType, activityDescription, hrsCompleted = null) {
        let response = await Validator.validateUser(userId, null, null, null);
        if (response.code !== 200) {
            return response;
        }

        let user = await User.getUserInternal(userId);
        if (!user) {
            return new Response("User does not exist", 404, {});
        }

        const hrs = hrsCompleted == null ? 0 : hrsCompleted;

        const newActivity = {
            userId: userId,
            tasks: tasks,
            activityTitle: activityName,
            activityType: activityType,
            notes: activityDescription,
            hrsCompleted: hrs
        };

        response = await Validator.validateActivityObject(newActivity);
        if (response.code !== 200) {
            return response;
        }


        try {
            let activity = new this(newActivity);
            for (let task of tasks) {
                let response = await Task.addActivityToTask(userId, task, activity._id, hrs);
                if (response.code !== 200) {
                    return response;
                }
            }
            await activity.save();
            return new Response("Activity created successfully", 200, activity);
        } catch (error) {
            return new Response("Error creating activity", 400, { error });
        }
    }

    static getActivityById(activityId) {

        const { activity, error } = this.findById(activityId)
        if (error) {
            return new Response("Error finding activity", 400, { error });
        }
        return new Response("Activity found", 200, activity);
    }



    static async updateActivity(activityId, newActivityName, newStartDate, newEndDate, newStatus, newHours) {
        let response = getActivityById(activityId);
        if (response.code === 200) {
            const activity = response.data;
            activity.activityTitle = newActivityName == null ? activity.activityTitle : newActivityName;
            activity.startDate = newStartDate == null ? activity.startDate : newStartDate;
            activity.endDate = newEndDate == null ? activity.endDate : newEndDate;
            activity.status = newStatus == null ? activity.status : newStatus;
            activity.hrsCompleted = newHours == null ? activity.hours : newHours;

            let response = Validator.validateActivity(activity);
            if (response.code !== 200) {
                return response;
            }

            if (newHours != null) {
                for (let task of activity.tasks) {
                    let response = await Task.addHrs(task, newHours);
                    if (response.code !== 200) {
                        return response;
                    }
                }
            }

            await activity.save();
            return new Response("Activity updated successfully", 200, {});
        } else {
            return response;
        }
    }

    static readActivity(activityId) {
        let response = Validator.validateActivity(null, null, null, null, null, null, activityId);
        if (response.code !== 200) {
            return response;
        }

        const activity = this.findById(activityId);
        if (activity) {
            return new Response("Activity found", 200, activity);
        } else {
            return new Response("Activity not found", 404, { activityId });

        }
    }

    static async readAllUserActivities(userId) {
        let response = await Validator.validateUser(userId, null, null, null, null, null, null);
        if (response.code !== 200) {
            return response;
        }
        const user = await User.getUserInternal(userId);
        if (user) {
            const activities = await this.find({ userId: userId });
            return new Response("Activities found", 200, { activities });
        } else {
            return new Response("User not found", 404, {});
        }
    };


    static readAllTaskActivities(taskId) {
        let response = Validator.validateTask(taskId, null, null, null, null, null);
        if (response.code !== 200) {
            return response;
        };
        let output = [];
        try {
            for (let activity of this.find()) {
                if (activity.tasks.includes(taskId)) {
                    output.push(activity);
                }
            }

            return new Response("Activities found", 200, output);
        }
        catch (error) {
            return new Response("Error reading activities", 400, { error });
        }
    }

    static async readAllMilestoneActivities(userId, moduleCode, milestoneId) {
        let response = [];
        response.push(Validator.validateUser(userId, null, null, null, null, null, null));
        response.push(Validator.validateModule(moduleCode, null, null, null, null));
        response.push(Validator.validateMilestone(milestoneId, null, null, null, null));
        if (response.some(res => res.code !== 200)) {
            return response.find(res => res.code !== 200);
        }

        const user = await User.getUserInternal(userId);
        if (user) {
            const milestone = user.semester.find(semester => semester.modules.find(module => module.moduleCode === moduleCode).find(milestone => milestone.id === milestoneId));
            if (milestone) {
                const activities = this.find({ userId: userId });
                return new Response("Activities found", 200, activities);
            } else {
                return new Response("Milestone not found", 404, { milestoneId });
            }
        } else {
            return new Response("User not found", 404, { userId });
        }
    }

    static async deleteActivity(userid, activityId) {
        console.log("activityId", activityId);
        let response = await Validator.validateUser(userid, null, null, null, null, null, null);
        if (response.code !== 200) {
            return response;
        }
        const activity = await this.findOne({ _id: activityId })
        activity.tasks.forEach(async task => {
            let response = await Task.deleteActivityFromTask(userid, task, activityId, activity.hrs);
            if (response.code !== 200) {
                return response;
            }
        });
        await this.findByIdAndDelete(activityId);
        return new Response("Activity deleted successfully", 200, {});
    }
}


activitySchema.loadClass(ActivityService);
const Activity = model('Activity', activitySchema);

export default Activity;
