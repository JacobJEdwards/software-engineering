import userSchema from "../models/User.js";
import { model } from "mongoose";
import Module from "../service/ModuleService.js";
import Semester from "../service/SemesterService.js";
import Milestone from "../service/MilestoneService.js";
import User from "./UserService.js";

class ImportService {
    static async addFileData(file, userid) {
        let user = await User.getUserInternal(userid);
        for (let element of file) {
            let response = Semester.createSemester(element.SemesterName, element.SemesterStartDate, element.SemesterEndDate, user);
            if (response.code != 200) {
                return response;
            }
        }

        await user.save();

        for (let element of file) {
            let response = Module.createModule(element.SemesterName, element.ModuleName, element.ModuleCode, element.ModuleStartDate, element.ModuleEndDate, user)
            if (response.code != 200) {
                return response;
            }
        }
        await user.save();
        for (let element of file) {
            let response = Milestone.createMilestone(user, element.ModuleCode, element.MilestoneTitle, element.MilestoneType, element.MilestoneStartDate, element.MilestoneEndDate, true)
            if (response.code != 200) {
                return response;
            }
        }

        await user.save();
        return new Response(200, "Data added successfully", {});
    }
}

userSchema.loadClass(ImportService);
const Import = model('import', userSchema);

export default Import;
