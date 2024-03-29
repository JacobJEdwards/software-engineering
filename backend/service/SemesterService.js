import userSchema from "../models/User.js";
import { model } from "mongoose";
import Response from "../utils/Response.js";
import { watch } from "gulp";

class SemesterService {
    static createSemester(semesterName, semesterStartDate, semesterEndDate, user) {
        const semesterExists = user.semester.find(semester => semester.semesterName === semesterName);
        if (!semesterExists) {
            const newSemester = { semesterName: semesterName, modules: [], startDate: semesterStartDate, endDate: semesterEndDate };
            user.semester.push(newSemester);
            return new Response("Semester created successfully", 200, {});
        } else {
            return new Response("Semester already exists", 400, {});
        }
    }

    static async createSemesterByUserId(userId, semesterName, semesterStartDate, semesterEndDate) {
        const user = await UserService.getUserInternal(userId);
        if (user) {
            let response = this.createSemester(semesterName, semesterStartDate, semesterEndDate, user);
            if (response.code === 200) {
                user.save();
                return response;
            } else {
                return response;
            }
        } else {
            return new Response("User does not exist", 400, {});
        }
    }

    static readSemesterByName(semesterName, user) {
        const semester = user.semester.find(semester => semester.semesterName === semesterName);
        if (semester) {
            return Response("Semester found", 200, semester);
        } else {
            return Response("Semester does not exist", 404, {});
        }
    }

    static readSemesterByModule(moduleCode, user) {
        const semester = user.semester.find(semester => semester.modules.some(module => module.moduleCode === moduleCode));
        if (semester) {
            return Response("Semester found", 200, semester);
        } else {
            return Response("Semester not found", 404, {});
        }
    }

    static readSemesterByMilestone(milestoneName, user) {
        const semester = user.semester.find(semester => semester.modules.some(module => module.milestones.some(milestone => milestone.milestoneName === milestoneName)));
        if (semester) {
            return new Response("Semester found", 200, semester)
        } else {
            return new Response("Semester not found", 404, {});
        }
    }

    static async readSemesterByUserId(userId, semesterName) {
        const user = await UserService.getUserInternal(userId);
        if (user) {
            let response = this.readSemesterByName(semesterName, user);
            return response;
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
            return new Response("Semester does not exist", 404, {});
        }
    }

    static async updateSemesterByUserId(userId, semesterName, newSemesterName) {
        const user = await UserService.getUserInternal(userId);
        if (user) {
            let response = this.updateSemester(semesterName, newSemesterName, user);
            if (response.code === 200) {
                user.save();
            }
            return response;
        }
    }

    static deleteSemester(semesterName, user) {
        const semester = user.semester.find(semester => semester.semesterName === semesterName);
        if (semester) {
            user.semester.pull(semester);
            return new Response("Semester deleted", 200, {});
        } else {
            return new Response("Semester does not exist", 404, {});
        }
    }


    static async deleteSemesterByUserId(userId, semesterName) {
        const user = await UserService.getUserInternal(userId);
        if (user) {
            let response = this.deleteSemester(semesterName, user);
            return response;
        } else {
            return new Response("User does not exist", 404, {});
        }
    }
}


userSchema.loadClass(SemesterService);
const Semester = model('Semester', userSchema);

export default Semester;
