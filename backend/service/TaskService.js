import bcrypt from "bcryptjs";
import userSchema from "../models/User.js";
import {model} from "mongoose";

class TaskService {
    static async createTask(module, taskName, taskDescription, taskDate) {


            const newTask = {
                taskName: taskName,
                taskDescription: taskDescription,
                taskDate: taskDate
            };
            module.tasks.push(newTask);
            return module;
    }

    updateTask(module, taskId, newTaskName, newTaskDescription, newTaskDate) {
        const task = module.tasks.find(task => task.id === taskId);
        if (task) {
            task.taskName = newTaskName;
            task.taskDescription = newTaskDescription;
            task.taskDate = newTaskDate;
            console.log("Task updated successfully");
            return module;
        } else {
            console.log("Task does not exist");
            return null;
        }
    }

    readTask(module, taskId) {
        const task = module.tasks.find(task => task.id === taskId);
        if (task) {
            return task;
        } else {
            console.log("Task does not exist");
            return null;
        }
    }

    deleteTask(module, taskId) {
        const task = module.tasks.find(task => task.id=== taskId);
        if (task) {
            module.tasks.pull(task);
            console.log("Task deleted successfully");
            return module;
        } else {
            console.log("Task does not exist");
            return null;
        }
    }
}
userSchema.loadClass(TaskService);
const Task = model('Task', userSchema);

export default Task;
