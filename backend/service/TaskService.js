import userSchema from "../models/User.js";
import { model } from "mongoose";
import Response from "../utils/Response.js";

class TaskService {
    static createTask(user, milestoneId, taskName, taskDescription, taskDate) {
        const milestone = user.modules.find(module => module.find(milestone => milestone.id === milestoneId));
        if (!milestone) {
            return new Response("Milestone does not exist", 404,);
        }
        const newTask = {
            taskName: taskName,
            taskDescription: taskDescription,
            taskDate: taskDate
        };
        milestone.tasks.push(newTask);
        return new Response("Task created successfully", 200, {});
    }


    static async createTaskByUserId(userId, milestoneId, taskName, taskDescription, taskDate) {
        const user = await UserService.getUserInternal(userId);
        if (user) {
            let response = this.createTask(user, milestoneId, taskName, taskDescription, taskDate);
            if (response.status === 200) {
                user.save();
                return response;
            } else {
                return response;
            }
        } else {
            return new Response("User does not exist", 404, {});
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
            return new Response("Task does not exist", 404, {});
        }
    }


    static async updateTaskByUserId(userId, taskId, newTaskName, newStartDate, newEndDate, newStatus, newHours) {
        const user = await UserService.getUserInteral(userId);
        if (user) {
            let response = this.updateTask(user, taskId, newTaskName, newStartDate, newEndDate, newStatus, newHours);
            if (response.status === 200) {
                user.save();
            }
            return response;
        } else {
            return new Response("User does not exist", 404, {});
        }
    }

    static readTask(module, taskId) {
        const task = module.tasks.find(task => task.id === taskId);
        if (task) {
            return Response("Task found", 200, task);
        } else {
            return Response("Task does not exist", 404, {});
        }
    }


    static async readTaskByUserId(userId, taskId) {
        const user = await UserService.getUserInteral(userId);
        if (user) {
            let response = this.readTask(user, taskId);
            return response;
        } else {
            return new Response("User does not exist", 404, {});
        }
    }


    static async TasksFromDate(userId, date) {
        const user = await UserService.getUserInteral(userId);
        let tasks = user.modules.filter(mod => mod.tasks.filter(task => task.taskDate === date));
        return new Response("Tasks found", 200, tasks);
    }



    static deleteTask(module, taskId) {
        const task = module.tasks.find(task => task.id === taskId);
        if (task) {
            module.tasks.pull(task);
            return new Response("Task deleted successfully", 200, {});
        } else {
            return new Response("Task does not exist", 404, {});
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
            return new Response("User does not exist", 404, {});
        }
    }

}

userSchema.loadClass(TaskService);
const Task = model('Task', userSchema);

export default Task;
