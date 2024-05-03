import userSchema from "../models/User.js";
import { model } from "mongoose";
import Response from "../utils/Response.js";
import User from "./UserService.js";
import Module from "./ModuleService.js";
import Milestone from "./MilestoneService.js";
import Validator from "../middleware/Validator.js";

class TaskService {
  static async createTask(
    user,
    milestoneId,
    title,
    startDate,
    endDate,
    progress,
    hrsCompleted,
    hrsRequired,
  ) {
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
      return new Response("Milestone does not exist", 404, { milestoneId });
    }
    const newTask = {
      title: title,
      startDate: startDate,
      endDate: endDate,
      status: progress,
      hrsCompleted: hrsCompleted,
      hrsRequired: hrsRequired,
      activities: [],
    };

    const response = await Validator.validateTaskObject(newTask);
    if (response.code !== 200) {
      return response;
    }

    tasks.push(newTask);
    return new Response("Task created successfully", 200, { newTask });
  }
  static async createTaskByUserId(
    userId,
    milestoneId,
    title,
    startDate,
    endDate,
    progress,
    hrsCompleted,
    hrsRequired,
  ) {
    const response = await Validator.validateUser(userId, null, null, null);

    if (response.code !== 200) {
      return response;
    }
    const user = await User.getUserInternal(userId);
    if (user) {
      let response = await this.createTask(
        user,
        milestoneId,
        title,
        startDate,
        endDate,
        progress,
        hrsCompleted,
        hrsRequired,
      );
      if (response.code === 200) {
        await user.save();
        return response;
      } else {
        return response;
      }
    } else {
      return new Response("User does not exist", 404, { userId });
    }
  }

  static async updateTask(
    user,
    taskId,
    newTaskName,
    newStartDate,
    newEndDate,
    newStatus,
    hrsRequired,
    hrsCompleted,
  ) {
    const response = await Validator.validateTask(taskId, null, null, null);
    if (response.code !== 200) {
      return response;
    }
    const task = user.semester.flatMap((modules) =>
      modules.flatMap((mod) =>
        mod.milestones.flatMap((mil) =>
          mil.tasks.find((task) => task._id === taskId),
        ),
      ),
    );

    if (task) {
      task.taskName = newTaskName == null ? task.taskName : newTaskName;
      task.startDate = newStartDate == null ? task.startDate : newStartDate;
      task.endDate = newEndDate == null ? task.endDate : newEndDate;
      task.status = newStatus == null ? task.status : newStatus;
      task.hrsRequired = hrsRequired == null ? task.hrsRequired : hrsRequired;
      task.hrsCompleted = hrsCompleted = null
        ? task.hrsCompleted
        : hrsCompleted;
      return await Validator.validateTask(task);
    } else {
      return new Response("Task does not exist", 404, { taskId });
    }
  }

  static async updateTaskByUserId(
    userId,
    taskId,
    newTaskName,
    newStartDate,
    newEndDate,
    newStatus,
    newHrsRequired,
    newHrsCompleted,
  ) {
    const user = await User.getUserInternal(userId);
    if (user) {
      let response = this.updateTask(
        user,
        taskId,
        newTaskName,
        newStartDate,
        newEndDate,
        newStatus,
        newHrsRequired,
        newHrsCompleted,
      );
      if (response.status === 200) {
        user.save();
      }
      return response;
    } else {
      return new Response("User does not exist", 404, { taskId });
    }
  }

  static async readTask(module, taskId) {
    const response = await Validator.validateTask(taskId, null, null, null);
    if (response.code !== 200) {
      return response;
    }

    const task = module.tasks.find((task) => task.id === taskId);
    if (task) {
      return Response("Task found", 200, task);
    } else {
      return Response("Task does not exist", 404, { taskId });
    }
  }

  static async readTaskByUserId(userId, taskId) {
    const response = await Validator.validateUser(userId, null, null, null);
    if (response.code !== 200) {
      return response;
    }
    const user = await User.getUserInteral(userId);
    if (user) {
      let response = this.readTask(user, taskId);
      return response;
    } else {
      return new Response("User does not exist", 404, { taskId });
    }
  }

  static async TasksFromDate(userId, date) {
    const response = await Validator.validateUser();
    if (response.code !== 200) {
      return response;
    }
    let user = await User.getUserInternal(userId);
    if (!user) {
      return new Response("User does not exist", 404, { userId });
    } else if (date < new Date()) {
      return new Response("Invalid date", 400, { date });
    }
    let tasks = user.modules.filter((mod) =>
      mod.tasks.filter((task) => task.taskDate === date),
    );
    return new Response("Tasks found", 200, tasks);
  }

  static async TaskFromToDate(userId, fromDate, toDate) {
    let user = await User.getUserInternal(userId);
    if (!user) {
      return new Response("User does not exist", 404, { userId });
    } else if (fromDate > toDate) {
      return new Response("Invalid date range", 400, { fromDate, toDate });
    }

    let tasks = user.semester.flatMap((sem) =>
      sem.modules.flatMap((mod) =>
        mod.milestones.flatMap((mil) =>
          mil.tasks.filter(
            (task) => task.taskDate >= fromDate && task.taskDate <= toDate,
          ),
        ),
      ),
    );
    return new Response("Tasks found", 200, tasks);
  }

  static async readTasksByModuleId(userId, moduleId) {
    let user = await User.getUserInternal(userId);
    if (!user) {
      return new Response("User does not exist", 404, { userId });
    }
    let response = Module.readModule(user, moduleId);
    if (response.status !== 200) {
      return response;
    }
    let tasks = user.modules
      .flatMap((mod) => mod.moduleCode === moduleId)
      .milestones.flatMap((mil) => mil.tasks);
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

  static async addActivityToTask(userId, taskId, activityId, hrs) {
    const response = await Validator.validateUser(userId, null, null, null);
    if (response.code !== 200) {
      return response;
    }
    const user = await User.getUserInternal(userId);
    if (!user) {
      return new Response("User does not exist", 404, { userId });
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

    return new Response("Task does not exist", 404, { taskId });
  }

  static async deleteActivityFromTask(userId, taskId, activityId, hrs) {
    const response = await Validator.validateUser(userId, null, null, null);
    if (response.code !== 200) {
      return response;
    }

    const user = await User.getUserInternal(userId);
    if (!user) {
      return new Response("User does not exist", 404, { userId });
    }

    user.semester.forEach((semester) => {
      semester.modules.forEach((module) => {
        module.milestones.forEach((milestone) => {
          milestone.tasks.forEach(async (task) => {
            if (task.id === taskId) {
              const index = task.activities.findIndex(
                (activity) => activity === activityId,
              );
              if (index !== -1) {
                task.activities.splice(index, 1);
                await this.addHrs(userId, taskId, -hrs);
                await user.save();
                return new Response("Activity deleted from task", 200, {
                  activityId,
                });
              }
            }
          });
        });
      });
    });

    return new Response("Activity does not exist", 400, {});
  }

  static async addHrs(userId, taskId, hrs) {
    const response = await Validator.validateUser(userId, null, null, null);
    if (response.code !== 200) {
      return response;
    }

    const user = await User.getUserInternal(userId);
    if (!user) {
      return new Response("User does not exist", 404, { userId });
    }

    const task = user.semester
      .flatMap((sem) =>
        sem.modules.flatMap((mod) =>
          mod.milestones.flatMap((mil) =>
            mil.tasks.find((task) => task.id.valueOf() === taskId),
          ),
        ),
      )
      .filter(Boolean)[0];

    if (!task) {
      return new Response("Task does not exist", 404, { taskId });
    }

    task.hrsCompleted += hrs;
    if (task.hrsCompleted >= task.hrsRequired) {
      task.status = "Completed";
    } else {
      task.status = "In Progress";
    }
    await user.save();

    return new Response("Hours added", 200, { hrs });
  }

  static async deleteTask(user, taskId) {
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

    let deleted = false;
    for (let semester of user.semester) {
      for (let module of semester.modules) {
        for (let milestone of module.milestones) {
          const index = milestone.tasks.findIndex(
            (task) => task._id.valueOf() === taskId,
          );
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
      return new Response("Task does not exist", 404, { taskId });
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
      return new Response("User does not exist", 404, { taskId });
    }
  }
}

userSchema.loadClass(TaskService);
const Task = model("Task", userSchema);

export default Task;
