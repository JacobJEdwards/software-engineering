import bcrypt from "bcryptjs";
import userSchema from "../models/User.js";
import {model} from "mongoose";
import Module from "../service/ModuleService.js";
import Semester from "../service/SemesterService.js";
import Milestone from "../service/MilestoneService.js";
import User from "./UserService.js";

class ImportService {
    static async addFileData(file, user_id) {
        let user = await User.findById(user_id);
        for (let element of file) {
            await Semester.createSemester(element.SemesterName, element.SemesterStartDate, element.SemesterEndDate, user);
        }

        for (let element of file) {
            await Module.createModule(element.SemesterName, element.Module, element.ModuleCode, element.ModuleStartDate, element.ModuleEndDate, user);
        }

       for (let element of file)  {
           await Milestone.createMilestone(element.ModuleCode, element.MilestoneTitle, element.MilestoneType, element.MilestoneStartDate, element.MilestoneEndDate, true);
       }


    }
}

userSchema.loadClass(ImportService);
const Import = model('import', userSchema);

export default Import;
