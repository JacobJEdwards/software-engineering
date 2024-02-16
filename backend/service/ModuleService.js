import bcrypt from "bcryptjs";
import userSchema from "../models/User.js";
import {model} from "mongoose";
import user from "../models/User.js";

class ModuleService {
    static async addModule(file, user_id) {
        const module = {
        };

        const user = await user.findById(user_id);
        user.modules.push(module);
    }
}


userSchema.loadClass(ImportService);
const Import = model('import', userSchema);

export default Import;
