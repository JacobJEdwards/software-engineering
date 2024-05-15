import Tasks from "../service/TaskService.js";

class TaskController {
  static async getTasks(req, res) {
    if (req.query.from && req.query.to) {
      const tasks = await Tasks.TaskFromToDate(
        req.userData.userId,
        req.query.from,
        req.query.to,
      );
      res.status(tasks.code).send({ message: tasks.message, data: tasks.data });
    } else if (req.query.date) {
      const tasks = await Tasks.TasksFromDate(
        req.userData.userId,
        req.query.date,
      );
      res.status(tasks.code).send({ message: tasks.message, data: tasks.data });
    } else if (req.query.moduleId) {
      const tasks = await Tasks.readTasksByModuleId(
        req.userData.userId,
        req.query.moduleId,
      );
      res.status(tasks.code).send({ message: tasks.message, data: tasks.data });
    } else if (req.query.milestoneId) {
      const tasks = await Tasks.readTasksByMilestoneId(
        req.userData.userId,
        req.query.milestoneId,
      );
      res.status(tasks.code).send({ message: tasks.message, data: tasks.data });
    } else {
      const tasks = await Tasks.readTaskByUserId(req.userData.userId);
      res.status(tasks.code).send({ message: tasks.message, data: tasks.data });
    }
  }

  static async createTask(req, res) {
    const tasks = await Tasks.createTaskByUserId(
      req.userData.userId,
      req.body.milestoneId,
      req.body.tasktitle,
      req.body.startDate,
      req.body.endDate,
      req.body.progress,
      req.body.dependantTasks,
      req.body.hrsCompleted,
      req.body.hrsRequired,
    );
    res.status(tasks.code).send({ message: tasks.message, data: tasks.data });
  }

  static async updateTask(req, res) {
    const tasks = await Tasks.updateTaskByUserId(
      req.userData.userId,
      req.body.taskId,
      req.body.title,
      req.body.startDate,
      req.body.endDate,
      req.body.progress,
      req.body.dependantTasks,
      req.body.hrsRequired,
      req.body.hrsCompleted,
    );
    res.status(tasks.code).send({ message: tasks.message, data: tasks.data });
  }

  static async deleteTask(req, res) {
    const tasks = await Tasks.deleteTaskByUserId(
      req.userData.userId,
      req.body.taskId,
    );
    res.status(tasks.code).send({ message: tasks.message, data: tasks.data });
  }
}

export default TaskController;
