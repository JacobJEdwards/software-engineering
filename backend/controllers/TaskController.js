import Tasks from '../service/TaskService.js';

class TaskController {
    static async getTasks(req, res) {
        if (req.query.from && req.query.to) {
            const tasks = await Tasks.TaskFromToDate(req.userData.userId, req.query.from, req.query.to);
            res.status(tasks.code).send(tasks);
        } else if (req.query.date) {
            const tasks = await Tasks.TasksFromDate(req.userData.userId, req.query.date);
            res.status(tasks.code).send(tasks);
        } else if (req.query.moduleId) {
            const tasks = await Tasks.readTasksByModuleId(req.userData.userId, req.query.moduleId);
            res.status(tasks.code).send(tasks);
        } else if (req.query.milestoneId) {
            const tasks = await Tasks.readTasksByMilestoneId(req.userData.userId, req.query.milestoneId);
            res.status(tasks.code).send(tasks);
        } else {
            const tasks = await Tasks.readTaskByUserId(req.userData.userId);
            res.status(tasks.code).send(tasks);
        }
    }

    static async createTask(req, res) {
        const task = await Tasks.createTask(req.userData.userId, req.body.moduleId, req.body.milestoneId, req.body.taskTitle, req.body.taskDescription, req.body.taskDate, req.body.taskTime);
        res.status(task.code).send(task);
    }


    static async updateTask(req, res) {
        const task = await Tasks.updateTaskByUserId(req.userData.userId, req.body.taskId, req.body.taskTitle, req.body.taskDescription, req.body.startDate, req.body.endDate, req.body.status, req.body.hours);
        res.status(task.code).send(task);
    }

    static async deleteTask(req, res) {
        const task = await Tasks.deleteTaskByUserId(req.userData.userId, req.body.taskId);
        res.status(task.code).send(task);
    }

}

export default TaskController;
