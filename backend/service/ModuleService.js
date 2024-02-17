import userSchema from "../models/User.js";
import {model} from "mongoose";
import UserService from "./UserService.js";
class ModuleService {
    static async addModule(semesterName, module, user_id) {
        const user = await UserService.getUserById(user_id);
        user.semester.forEach(semester => {
            console.log(semester.semesterName);
        });
        await user.save();
    }
}


userSchema.loadClass(ModuleService);
const Module = model('Module', userSchema);

export default Module;
