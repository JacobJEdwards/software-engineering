import userSchema from "../models/User.js";
import {model} from "mongoose";
import UserService from "./UserService.js";

class ModuleService {
    createModule(moduleName, moduleCode, user) {
        const moduleExists = user.modules.some(module => module.moduleCode === moduleCode);
        if (!moduleExists) {
            const newModule = {
                moduleName: moduleName,
                moduleCode: moduleCode,
                milestones: [],
                startDate: Date.now(),
                endDate: Date.now()
            };
            user.modules.push(newModule);
            return user;
        } else {
            console.log("Module already exists");
        }
    }

    readModule(moduleCode, user) {
        const module = user.modules.find(module => module.moduleCode === moduleCode);
        if (module) {
            return module;
        } else {
            console.log("Module does not exist");
            return null;
        }
    }


    editModule(moduleCode, newModuleName, user) {
        const module = user.modules.find(module => module.moduleCode === moduleCode);
        if (module) {
            module.moduleName = newModuleName;
            console.log("Module updated successfully");
            return user;
        } else {
            console.log("Module does not exist");
            return null;
        }
    }

    deleteModule(moduleCode, user) {
        const module = user.modules.find(module => module.moduleCode === moduleCode);
        if (module) {
            user.modules.pull(module);
            console.log("Module deleted successfully");
            return user;
        } else {
            console.log("Module does not exist");
            return null;
        }
    }
}


userSchema.loadClass(ModuleService);
const Module = model('Module', userSchema);

export default Module;
