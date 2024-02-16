import bcrypt from "bcryptjs";
import userSchema from "../models/User.js";
import {model} from "mongoose";

class TaskService {
}
userSchema.loadClass(TaskService);
const Task = model('User', userSchema);

export default Task;
