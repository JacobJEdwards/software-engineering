import userSchema from "../models/User.js";
import {model} from "mongoose";
import Response from "../utils/Response.js";
import User from "./UserService.js";
import Module from "./ModuleService.js";
import Milestone from "./MilestoneService.js";
import Validator from "../middleware/Validator.js";
import ActivityService from "./ActivityService.js";

class TaskService {
    static async createTask(user, milestoneId, title, startDate, endDate, progress, taskDependancies, hrsCompleted, hrsRequired,) {
        let tasks = null;
        for (let semester of user.semester) {
            for (let module of semester.modules) {
                for (let milestone of module.milestones) {
                    if (milestone._id.valueOf() === milestoneId) {
                        tasks = milestone.tasks;
                        break;
                    }
                }
                if (tasks) break;
            }
            if (tasks) break;
        }
        if (tasks === null) {
            return new Response("Milestone does not exist", 404, {milestoneId});
        }
        taskDependancies = taskDependancies === null ? [] : taskDependancies;
        const newTask = {
            title: title,
            startDate: startDate,
            endDate: endDate,
            status: progress,
            hrsCompleted: hrsCompleted,
            hrsRequired: hrsRequired,
            dependantTasks: taskDependancies,
            activities: [],
        };
        const response = await Validator.validateTaskObject(newTask);
        if (response.code !== 200) {
            return response;
        }
        tasks.push(newTask);
        return new Response("Task created successfully", 200, {newTask});
    }

    static async createTaskByUserId(userId, milestoneId, title, startDate, endDate, progress, dependantTasks, hrsCompleted, hrsRequired,) {
        const response = await Validator.validateUser(userId, null, null, null);
        if (response.code !== 200) {
            return response;
        }
        const user = await User.getUserInternal(userId);
        if (user) {
            let response = await this.createTask(user, milestoneId, title, startDate, endDate, progress, dependantTasks, hrsCompleted, hrsRequired,);
            if (response.code === 200) {
                await user.save();
                return response;
            } else {
                return response;
            }
        } else {
            return new Response("User does not exist", 404, {userId});
        }
    }

    static async updateTask(user, taskId, newTaskName, newStartDate, newEndDate, newStatus, newListOfDependantTasks, hrsRequired, hrsCompleted,) {
        /*
        const response = await Validator.validateTask(
          taskId,
          null,
          null,
          null,
          null,
          null,
          null,
        );
        if (response.code !== 200) {
          return response;
        }
         */
        const task = user.semester
            .flatMap((sem) => sem.modules.flatMap((mod) => mod.milestones.flatMap((mil) => mil.tasks.find((task) => task._id.valueOf() === taskId),),),)
            .filter(Boolean)[0];
        if (!task) {
            return new Response("Task does not exist", 404, {taskId});
        }
        task.title = newTaskName ?? task.title;
        task.startDate = newStartDate ?? task.startDate;
        task.endDate = newEndDate ?? task.endDate;
        task.status = newStatus ?? task.status;
        task.dependantTasks = newListOfDependantTasks ?? task.dependantTasks;
        task.hrsRequired = hrsRequired ?? task.hrsRequired;
        task.hrsCompleted = hrsCompleted ?? task.hrsCompleted;
        const response = await Validator.validateTaskObject(task);
        if (response.code !== 200) {
            return response;
        }
        await user.save();
        return new Response("Task updated", 200, task);
    }

    static async updateTaskByUserId(userId, taskId, newTaskName, newStartDate, newEndDate, newStatus, newDependantTasks, newHrsRequired, newHrsCompleted,) {
        const user = await User.getUserInternal(userId);
        if (!user) {
            return new Response("User does not exist", 404, {taskId});
        }
        return await this.updateTask(user, taskId, newTaskName, newStartDate, newEndDate, newStatus, newDependantTasks, newHrsRequired, newHrsCompleted,);
    }

    static async readTask(module, taskId) {
        const response = await Validator.validateTask(taskId, null, null, null);
        if (response.code !== 200) {
            return response;
        }

        const task = module.tasks.find((task) => task.id === taskId);
        if (task) {
            return new Response("Task found", 200, task);
        }
        return new Response("Task does not exist", 404, {taskId});
    }

    static async readTaskByUserId(userId, taskId) {
        const response = await Validator.validateUser(userId, null, null, null);
        if (response.code !== 200) {
            return response;
        }
        const user = await User.getUserInteral(userId);
        if (user) {
            return this.readTask(user, taskId);
        }
        return new Response("User does not exist", 404, {taskId});
    }

    static async TasksFromDate(userId, date) {
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
        let tasks = user.semester.flatMap((sem) => sem.modules.flatMap((mod) => mod.milestones.flatMap((mil) => mil.tasks.filter((task) => task.startDate >= fromDate))));
        return new Response("Tasks found", 200, tasks);
    }

    static async TaskFromToDate(userId, fromDate, toDate) {
        let user = await User.getUserInternal(userId);
        if (!user) {
            return new Response("User does not exist", 404, {userId});
        } else if (fromDate > toDate) {
            return new Response("Invalid date range", 400, {fromDate, toDate});
        }
        let tasks = user.semester.flatMap((sem) => sem.modules.flatMap((mod) => mod.milestones.flatMap((mil) => mil.tasks.filter((task) => task.startDate >= fromDate && task.endDate <= toDate,),),),);
        return new Response("Tasks found", 200, tasks);
    }

    static async readTasksByModuleId(userId, moduleId) {
        const user = await User.getUserInternal(userId);
        if (!user) {
            return new Response("User does not exist", 404, {userId});
        }
        const response = Module.readModule(user, moduleId);
        if (response.status !== 200) {
            return response;
        }
        const tasks = user.semester.modules
            .flatMap((mod) => mod.moduleCode === moduleId)
            .flatMap((mil) => mil.tasks);
        return new Response("Tasks found", 200, tasks);
    }

    static async readTasksByMilestoneId(userId, milestoneId) {
        const user = await User.getUserInternal(userId);
        if (!user) {
            return new Response("User does not exist", 404, {userId});
        }
        const response = await Milestone.readMilestoneByUser(user, milestoneId);
        if (response.status !== 200) {
            return response;
        }
        return new Response("Tasks found", 200, response.message.tasks);
    }

    static async addActivityToTask(userId, taskId, activityId, hrs) {
        const response = await Validator.validateUser(userId, null, null, null);
        if (response.code !== 200) {
            return response;
        }
        const user = await User.getUserInternal(userId);
        if (!user) {
            return new Response("User does not exist", 404, {userId});
        }
        for (let semester of user.semester) {
            for (let module of semester.modules) {
                for (let milestone of module.milestones) {
                    for (let task of milestone.tasks) {
                        if (task._id.valueOf() === taskId) {
                            task.activities.push(activityId);
                            await this.addHrs(userId, taskId, hrs);
                            await user.save();
                            return new Response("Activity added to task", 200, {
                                activityId,
                            });
                        }
                    }
                }
            }
        }
        return new Response("Task does not exist", 404, {taskId});
    }

    static async deleteActivityFromTask(userId, taskId, activityId, hrs) {
        const response = await Validator.validateUser(userId, null, null, null);
        if (response.code !== 200) {
            return response;
        }
        const user = await User.getUserInternal(userId);
        if (!user) {
            return new Response("User does not exist", 404, {userId});
        }
        const task = user.semester
            .flatMap((sem) => sem.modules.flatMap((mod) => mod.milestones.flatMap((mil) => mil.tasks.find((task) => task._id.valueOf() === taskId),),),)
            .filter(Boolean)[0];
        if (!task) {
            return new Response("Task does not exist", 404, {taskId});
        }
        const index = task.activities.findIndex((activity) => activity._id.valueOf() === activityId,);
        if (index === -1) {
            return new Response("Activity does not exist", 404, {activityId});
        }
        task.activities.splice(index, 1);
        await this.addHrs(userId, taskId, -hrs);
        await user.save();
        return new Response("Activity deleted from task", 200, {
            activityId,
        });
    }

    static async addHrs(userId, taskId, hrs) {
        const response = await Validator.validateUser(userId, null, null, null);
        if (response.code !== 200) {
            return response;
        }
        const user = await User.getUserInternal(userId);
        if (!user) {
            return new Response("User does not exist", 404, {userId});
        }
        const task = user.semester
            .flatMap((sem) => sem.modules.flatMap((mod) => mod.milestones.flatMap((mil) => mil.tasks.find((task) => task._id.valueOf() === taskId),),),)
            .filter(Boolean)[0];
        if (!task) {
            return new Response("Task does not exist", 404, {taskId});
        }
        task.hrsCompleted += hrs;
        if (task.hrsCompleted < 0) {
            task.hrsCompleted = 0;
        }
        if (task.hrsCompleted >= task.hrsRequired) {
            task.status = "Completed";
        } else {
            task.status = "In Progress";
        }
        await user.save();
        return new Response("Hours added", 200, {hrs});
    }

    static async deleteTask(user, taskId) {
        const response = await Validator.validateTask(taskId, null, null, null, null, null, null,);
        if (response.code !== 200) {
            return response;
        }
        let deleted = false;
        for (let semester of user.semester) {
            for (let module of semester.modules) {
                for (let milestone of module.milestones) {
                    const index = milestone.tasks.findIndex((task) => task._id.valueOf() === taskId,);
                    if (index !== -1) {
                        milestone.tasks.splice(index, 1);
                        deleted = true;
                        break;
                    }
                }
                if (deleted) break;
            }
            if (deleted) break;
        }
        if (!deleted) {
            return new Response("Task does not exist", 404, {taskId});
        } else {
            return new Response("Task deleted successfully", 200, {});
        }
    }

    static async deleteTaskByUserId(userId, taskId) {
        const response = await Validator.validateUser(userId, null, null, null);
        if (response.code !== 200) {
            return response;
        }
        const user = await User.getUserInternal(userId);
        if (user) {
            let response = await this.deleteTask(user, taskId);
            if (response.code === 200) {
                user.save();
            }
            return response;
        } else {
            return new Response("User does not exist", 404, {taskId});
        }
    }
}

userSchema.loadClass(TaskService);
const Task = model("Task", userSchema);

export default Task;
