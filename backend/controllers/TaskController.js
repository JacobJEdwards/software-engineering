import Task from '../service/TaskService.js';

class TaskController {
    static async getTasks(req, res) {
        let startDate = req.query.startDate;
        console.log(req.userData);
        // let elements = await Task.tasksFromDate(req, startDate);
    }
}


export default TaskController
