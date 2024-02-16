import bcrypt from "bcryptjs";
import userSchema from "../models/User.js";
import {model} from "mongoose";

class TaskService {
    static async hello() {
        console.log('hello');
    }
}
userSchema.loadClass(TaskService);
const Task = model('Task', userSchema);

export default Task;
