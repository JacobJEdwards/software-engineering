import userSchema from "../models/User.js";
import {model} from "mongoose";
import Module from "../service/ModuleService.js";
import Semester from "../service/SemesterService.js";
import Milestone from "../service/MilestoneService.js";
import User from "./UserService.js";
import Response from "../utils/Response.js"
import Validator from "../middleware/Validator.js";

class ImportService {
    static async addFileDataUser(file, user) {
        let errors = {
            Semester: [],
            Module: [],
            Milestone: []
        };

        for (let element of file) {
            let response = Semester.createSemester(element.SemesterName, element.SemesterStartDate, element.SemesterEndDate, user);
            if (response.code !== 200) {
                errors.Semester.push(response);
            }
        }
        for (let element of file) {
            let response = Module.createModule(element.SemesterName, element.ModuleName, element.ModuleCode, element.ModuleStartDate, element.ModuleEndDate, user);
            if (response.code !== 200) {
                errors.Module.push(response);
            }
        }
        for (let element of file) {
            let response = Milestone.createMilestone(user, element.ModuleCode, element.MilestoneTitle, element.MilestoneType, element.MilestoneStartDate, element.MilestoneEndDate, true);
            if (response.code !== 200) {
                errors.Milestone.push(response);
            }

            const hasErrors = Object.values(errors).some(category => category.length > 0);
            if (hasErrors) {
                return new Response("Error encountered", 400, errors);
            } else {
                return new Response("Data added successfully", 200, {});
            }
        }
    }

    static async addFileData(file, userid) {
        let response = await Validator.validateUser(userid, null, null, null);
        if (response.code !== 200) {
            return response;
        }
        let user = await User.getUserInternal(userid);
        let errors = {
            Semester: [],
            Module: [],
            Milestone: []
        };
        for (let element of file) {
            let response = Semester.createSemester(element.SemesterName, element.SemesterStartDate, element.SemesterEndDate, user);
            if (response.code !== 200) {
                errors.Semester.push(response);
            }
        }
        for (let element of file) {
            let response = Module.createModule(element.SemesterName, element.ModuleName, element.ModuleCode, element.ModuleStartDate, element.ModuleEndDate, user);
            if (response.code !== 200) {
                errors.Module.push(response);
            }
        }
        for (let element of file) {
            let response = Milestone.createMilestone(user, element.ModuleCode, element.MilestoneTitle, element.MilestoneType, element.MilestoneStartDate, element.MilestoneEndDate, true);
            if (response.code !== 200) {
                errors.Milestone.push(response);
            }
        }
        const hasErrors = Object.values(errors).some(category => category.length > 0);
        if (hasErrors) {
            return new Response("Error encountered", 400, errors);
        } else {
            await user.save();
            return new Response("Data added successfully", 200, {});
        }
    }

    static async updateFileData(file, userid) {
        let response = await Validator.validateUser(userid, null, null, null);
        if (response.code !== 200) {
            return response;
        }
        let user = await User.getUserInternal(userid);
        if (user === null) {
            return new Response("User does not exist", 404, {});
        }
        for (let element of file) {
            Semester.deleteSemester(element.SemesterName, user);
        }

        for (let element of file) {
            Module.deleteModule(element.ModuleCode, element.SemesterName, user);
        }
        for (let element of file) {
            Milestone.deleteMilestoneByUser(user, element.ModuleCode, element.MilestoneTitle);
        }


        if (response.code !== 200) {
            return response;
        } else {
            await user.save();
            return new Response("Data reimported successfully", 200, {});
        }
    }

}

userSchema.loadClass(ImportService);
const Import = model('import', userSchema);
export default Import;
