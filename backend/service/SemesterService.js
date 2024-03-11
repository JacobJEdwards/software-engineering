import userSchema from "../models/User.js";
import {model} from "mongoose";

class SemesterService {
    static async createSemester(semesterName, user) {
        const semesterExists = user.semester.some(semester => semester.semesterName === semesterName);
        if (!semesterExists) {
            const newSemester = {semesterName: semesterName, modules: []};
            user.semester.push(newSemester);
            await user.save();
        } else {
            console.log("Semester already exists");
        }
    }

    static readSemesterByName(semesterName, user) {
        const semester = user.semester.find(semester => semester.semesterName === semesterName);
        if (semester) {
            return semester;
        } else {
            console.log("Semester does not exist");
            return null;
        }
    }

    readSemesterByModule(moduleCode, user) {
        const semester = user.semester.find(semester => semester.modules.some(module => module.moduleCode === moduleCode));
        if (semester) {
            return semester;
        } else {
            console.log("Semester does not exist");
            return null;
        }
    }

    readSemesterByMilestone(milestoneName, user) {
        const semester = user.semester.find(semester => semester.modules.some(module => module.milestones.some(milestone => milestone.milestoneName === milestoneName)));
        if (semester) {
            return semester;
        } else {
            console.log("Semester does not exist");
            return null;
        }
    }


    readSemesterByIdo(semesterId, user) {
        const semester = user.semester.find(semester => semester.some(semester => semester.id === semesterId));
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
            await user.save();
        } else {
            console.log("Semester does not exist");
        }
    }

    static async deleteSemester(semesterName, user) {
        const semester = user.semester.find(semester => semester.semesterName === semesterName);
        if (semester) {
            user.semester.pull(semester);
            console.log("Semester deleted successfully");
            await user.save();
        } else {
            console.log("Semester does not exist");
        }
    }
}


userSchema.loadClass(SemesterService);
const Semester = model('Semester', userSchema);

export default Semester;
