import userSchema from "../models/User.js";
import {model} from "mongoose";
import UserService from "./UserService.js";

class SemesterService {
    static async addSemester(semesterName, user_id) {
        const user = await UserService.getUserById(user_id);
        // Check if the semester with the given name already exists in the user's semesters
        const semesterExists = user.semester.some(semester => semester.semesterName === semesterName);

        if (!semesterExists) {
            const newSemester = { semesterName: semesterName, modules: [] };
            user.semester.push(newSemester);
            await user.save();
            console.log("Semester added successfully");
        } else {
            console.log("Semester already exists");
        }
    }
}


userSchema.loadClass(SemesterService);
const Semester = model('Semester', userSchema);

export default Semester;
