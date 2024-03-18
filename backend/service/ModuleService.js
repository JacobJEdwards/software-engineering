import userSchema from "../models/User.js";
import {model} from "mongoose";
import UserService from "./UserService.js";

class ModuleService {
    static async createModule(moduleName, moduleCode, moduleStartDate, moduleEndDate, user) {
        const moduleExists = user.modules.some(module => module.moduleCode === moduleCode);
        if (!moduleExists) {
            const newModule = {
                moduleName: moduleName,
                moduleCode: moduleCode,
                milestones: [],
                startDate: moduleStartDate,
                endDate: moduleEndDate
            };
            user.modules.push(newModule);
            await user.save();
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


    editModuleName(moduleCode, newModuleName, user) {
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

    editModuleCode(moduleCode, newModuleCode, user) {
        const module = user.modules.find(module => module.moduleCode === moduleCode);
        if (module) {
            module.moduleCode = newModuleCode;
            console.log("Module updated successfully");
            return user;
        } else {
            console.log("Module does not exist");
            return null;
        }
    }


    editModuleStartDate(moduleCode, newStartDate, user) {
        const module = user.modules.find(module => module.moduleCode === moduleCode);
        if (module) {
            module.startDate = newStartDate;
            console.log("Module updated successfully");
            return user;
        } else {
            console.log("Module does not exist");
            return null;
        }
    }

    editModuleEndDate(moduleCode, newEndDate, user) {
        const module = user.modules.find(module => module.moduleCode === moduleCode);
        if (module) {
            module.endDate = newEndDate;
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
