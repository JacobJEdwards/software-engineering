import userSchema from "../models/User.js";
import { model } from "mongoose";
import Response from "../utils/Response.js";
import User from "./UserService.js";
import Module from "./ModuleService.js";
import Milestone from "./MilestoneService.js";

class TaskService {
    static createTask(user, milestoneId, taskName, taskDescription, taskDate) {
        let milestoneFound = user.semester.find(sem => sem.module.find(module => module.milestoneId === milestoneId));
        if (!milestoneFound) {
            return new Response("Milestone does not exist", 404, { milestoneId });
        }

        const newTask = {
            taskName, taskDescription, taskDate
        };
        milestoneFound.tasks.push(newTask);
        return new Response("Task created successfully", 200, { newTask });
    }

    static async createTaskByUserId(userId, milestoneId, taskName, taskDescription, taskDate) {
        const user = await User.getUserInternal(userId);
        if (user) {
            let response = this.createTask(user, milestoneId, taskName, taskDescription, taskDate);
            if (response.statusCode === 200) {
                await user.save();
                return response;
            } else {
                return response;
            }
        } else {
            return new Response("User does not exist", 404, { userId });
        }
    }


    static updateTask(user, taskId, newTaskName, newStartDate, newEndDate, newStatus, newHours) {
        const task = user.modules(milestones => milestones.find(tasks => tasks.id === taskId));
        if (task) {
            task.taskName = newTaskName == null ? task.taskName : newTaskName;
            task.startDate = newStartDate == null ? task.startDate : newStartDate;
            task.endDate = newEndDate == null ? task.endDate : newEndDate;
            task.status = newStatus == null ? task.status : newStatus;
            task.hours = newHours == null ? task.hours : newHours;
            return new Response("Task updated successfully", 200, {});
        } else {
            return new Response("Task does not exist", 404, { taskId });
        }
    }


    static async updateTaskByUserId(userId, taskId, newTaskName, newStartDate, newEndDate, newStatus, newHours) {
        const user = await User.getUserInteral(userId);
        if (user) {
            let response = this.updateTask(user, taskId, newTaskName, newStartDate, newEndDate, newStatus, newHours);
            if (response.status === 200) {
                user.save();
            }
            return response;
        } else {
            return new Response("User does not exist", 404, { taskId });
        }
    }

    static readTask(module, taskId) {
        const task = module.tasks.find(task => task.id === taskId);
        if (task) {
            return Response("Task found", 200, task);
        } else {
            return Response("Task does not exist", 404, { taskId });
        }
    }


    static async readTaskByUserId(userId, taskId) {
        const user = await User.getUserInteral(userId);
        if (user) {
            let response = this.readTask(user, taskId);
            return response;
        } else {
            return new Response("User does not exist", 404, { taskId });
        }
    }

    static async TasksFromDate(userId, date) {
        let user = await User.getUserInternal(userId);
        if (!user) {
            return new Response("User does not exist", 404, { userId });
        } else if (date < new Date()) {
            return new Response("Invalid date", 400, { date });
        }
        let tasks = user.modules.filter(mod => mod.tasks.filter(task => task.taskDate === date));
        return new Response("Tasks found", 200, tasks);
    }

    static async TaskFromToDate(userId, fromDate, toDate) {
        let user = await User.getUserInternal(userId);
        if (!user) {
            return new Response("User does not exist", 404, { userId });
        } else if (fromDate > toDate) {
            return new Response("Invalid date range", 400, { fromDate, toDate });
        };

        let tasks = user.semester.flatMap(sem => sem.modules.flatMap(mod => mod.milestones.flatMap(mil => mil.tasks.filter(task => task.taskDate >= fromDate && task.taskDate <= toDate))));
        return new Response("Tasks found", 200, tasks);
    };


    static async readTasksByModuleId(userId, moduleId) {
        let user = await User.getUserInternal(userId);
        if (!user) {
            return new Response("User does not exist", 404, { userId });
        }
        let response = Module.readModule(user, moduleId);
        if (response.status !== 200) {
            return response;
        }
        let tasks = user.modules.flatMap(mod => mod.moduleCode === moduleId).milestones.flatMap(mil => mil.tasks);
        return new Response("Tasks found", 200, tasks);
    }

    static async readTasksByMilestoneId(userId, milestoneId) {
        let user = await User.getUserInternal(userId);
        if (!user) {
            return new Response("User does not exist", 404, { userId });
        }
        let response = Milestone.readMilestoneByUser(user, milestoneId);
        if (response.status !== 200) {
            return response;
        }
        return new Response("Tasks found", 200, response.message.tasks);
    }





    static deleteTask(module, taskId) {
        const task = module.tasks.find(task => task.id === taskId);
        if (task) {
            module.tasks.pull(task);
            return new Response("Task deleted successfully", 200, {});
        } else {
            return new Response("Task does not exist", 404, { taskId });
        }
    }


    static async deleteTaskByUserId(userId, taskId) {
        const user = await UserService.getUserInteral(userId);
        if (user) {
            let response = this.deleteTask(user, taskId);
            if (response.status === 200) {
                user.save();
            }
            return response;
        } else {
            return new Response("User does not exist", 404, { taskId });
        }
    }
}

userSchema.loadClass(TaskService);
const Task = model('Task', userSchema);

export default Task;
