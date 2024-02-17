import userSchema from "../models/User.js";
import {model} from "mongoose";
import UserService from "./UserService.js";

class SemesterService {
    static async addSemester(semesterName, user_id) {
        const user = await UserService.getUserById(user_id);
        const newSemester = { semesterName: semesterName, modules: [] }; // Example structure, adjust as needed
        user.semester.push(newSemester);
        await user.save();
    }
}


userSchema.loadClass(SemesterService);
const Semester = model('Semester', userSchema);

export default Semester;
