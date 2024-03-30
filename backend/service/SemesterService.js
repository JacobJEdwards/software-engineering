import userSchema from "../models/User.js";
import {model} from "mongoose";
import Response from "../utils/Response.js";

class SemesterService {
    static createSemester(semesterName, semesterStartDate, semesterEndDate, user) {
        const semesterExists = user.semester.find(semester => semester.semesterName === semesterName);
        if (!semesterExists) {
            const newSemester = {
                semesterName,
                modules: [],
                startDate: semesterStartDate,
                endDate: semesterEndDate
            };
            user.semester.push(newSemester);
            return new Response("Semester created successfully", 200, {});
        } else {
            return new Response(`Semester '${semesterName}' already exists`, 400, {semesterName});
        }
    }

    static async createSemesterByUserId(userId, semesterName, semesterStartDate, semesterEndDate) {
        const user = await UserService.getUserInternal(userId);
        if (user) {
            let response = this.createSemester(semesterName, semesterStartDate, semesterEndDate, user);
            await user.save();
            return response;
        } else {
            return new Response("User does not exist", 400, {});
        }
    }

    static readSemesterByName(semesterName, user) {
        const semester = user.semester.find(semester => semester.semesterName === semesterName);
        if (semester) {
            return new Response("Semester found", 200, semester);
        } else {
            return new Response(`Semester '${semesterName}' does not exist`, 404, {semesterName});
        }
    }

    // Similar changes for readSemesterByModule and readSemesterByMilestone...

    static async readSemesterByUserId(userId, semesterName) {
        const user = await UserService.getUserInternal(userId);
        if (user) {
            return this.readSemesterByName(semesterName, user);
        } else {
            return new Response("User does not exist", 404, {});
        }
    }

    static updateSemester(semesterName, newSemesterName, user) {
        const semester = user.semester.find(semester => semester.semesterName === semesterName);
        if (semester) {
            semester.semesterName = newSemesterName;
            return new Response("Semester updated", 200, {});
        } else {
            return new Response(`Semester '${semesterName}' does not exist`, 404, {semesterName});
        }
    }

    static deleteSemester(semesterName, user) {
        const semesterIndex = user.semester.findIndex(semester => semester.semesterName === semesterName);
        if (semesterIndex !== -1) {
            user.semester.splice(semesterIndex, 1);
            return new Response("Semester deleted", 200, {});
        } else {
            return new Response(`Semester '${semesterName}' does not exist`, 404, {semesterName});
        }
    }

    static async deleteSemesterByUserId(userId, semesterName) {
        const user = await UserService.getUserInternal(userId);
        if (user) {
            let response = this.deleteSemester(semesterName, user);
            return response;
        } else {
            return new Response("User does not exist", 404, {"userid": userId, "semester name": semesterName});
        }
    }
}


userSchema.loadClass(SemesterService);
const Semester = model('Semester', userSchema);

export default Semester;
