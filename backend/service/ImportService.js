import bcrypt from "bcryptjs";
import userSchema from "../models/User.js";
import {model} from "mongoose";
import Module from "../service/ModuleService.js";
import Semester from "../service/SemesterService.js";
import Milestone from "../service/MilestoneService.js";

class ImportService {
    static async addFileData(file, user_id) {
        let user = await User.findById(user_id);
        for (let element of file) {
            await Semester.createSemester(element.Semester, user);
            await Module.createModule(element.Module, element.ModuleCode, user);
            await Milestone.createMilestone(element.Module, element.Milestone, element.MilestoneDescription, element.MilestoneDate);
        }
    }
}

userSchema.loadClass(ImportService);
const Import = model('import', userSchema);

export default Import;
