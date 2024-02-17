import userSchema from "../models/User.js";
import {model} from "mongoose";
import UserService from "./UserService.js";
class ModuleService {
    static async addModule(semesterName, moduleData, user_id) {
        const user = await UserService.getUserById(user_id);
        const semester = user.semester.find(s => s.semesterName === semesterName);
        if (semester) {
            const moduleExists = semester.modules.some(mod => mod.moduleCode === moduleData.moduleCode);
            if (!moduleExists) {
                semester.modules.push(moduleData);
                await user.save();
                console.log("Module added successfully");
            } else {
                console.log("Module already exists");
            }
        } else {
            console.log("Semester does not exist");
        }
    }
}



userSchema.loadClass(ModuleService);
const Module = model('Module', userSchema);

export default Module;
