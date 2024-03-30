import Tasks from '../service/TaskService';

class TaskController {
    static async getTasks(req, res) {
        let startDate = req.query.startDate;
        let elements = await Tasks.TasksFromDate(req.userId, startDate);
        console.log(elements);
    }
}
