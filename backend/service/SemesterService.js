import userSchema from "../models/User.js";
import {model} from "mongoose";

class SemesterService {
    static async createSemester(semesterName, user) {
        const semesterExists = user.semester.some(semester => semester.semesterName === semesterName);
        if (!semesterExists) {
            const newSemester = {semesterName: semesterName, modules: []};
            user.semester.push(newSemester);
            return user;
        } else {
            console.log("Semester already exists");
            return null;
        }
    }

    static readSemester(semesterName, user) {
        const semester = user.semester.find(semester => semester.semesterName === semesterName);
        if (semester) {
            return semester;
        } else {
            console.log("Semester does not exist");
            return null;
        }
    }

    static async updateSemester(semesterName, newSemesterName, user) {
        const semester = user.semester.find(semester => semester.semesterName === semesterName);
        if (semester) {
            semester.semesterName = newSemesterName;
            console.log("Semester updated successfully");
            return user;
        } else {
            console.log("Semester does not exist");
            return null;
        }
    }

    static async deleteSemester(semesterName, user) {
        const semester = user.semester.find(semester => semester.semesterName === semesterName);
        if (semester) {
            user.semester.pull(semester);
            console.log("Semester deleted successfully");
            return user;
        } else {
            console.log("Semester does not exist");
            return null;
        }
    }
}


userSchema.loadClass(SemesterService);
const Semester = model('Semester', userSchema);

export default Semester;
