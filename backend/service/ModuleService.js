import userSchema from "../models/User.js";
import { model } from "mongoose";
import Response from "../utils/Response.js";
import UserService from "./UserService.js";

class ModuleService {
    static createModule(
        semesterName,
        moduleName,
        moduleCode,
        moduleStartDate,
        moduleEndDate,
        user) {
        const semesterExists = user.semester.find(
            (semesterObject) => semesterObject.semesterName === semesterName,
        );
        if (semesterExists) {
            const newModule = {
                moduleName: moduleName,
                moduleCode: moduleCode,
                milestones: [],
                startDate: moduleStartDate,
                endDate: moduleEndDate,
            };
            const moduleExists = user.semester
                .find((semester) => semester.semesterName === semesterName)
                .modules.some((module) => module.moduleCode === moduleCode);

            if (!moduleExists) {
                user.semester
                    .find((semester) => semester.semesterName === semesterName)
                    .modules.push(newModule);
                return new Response("Module created successfully", 200, {});
            }
        } else {
            return new Response("Semester does not exist", 404, {});
        }
    }

    static createModuleByUserId(userId, semesterName, moduleName, moduleCode, moduleStartDate, moduleEndDate) {
        const user = UserService.getUserInternal(userId);
        if (user) {
            let response = this.createModule(semesterName, moduleName, moduleCode, moduleStartDate, moduleEndDate, user);
            if (response.code === 200) {
                user.save();
                return response;
            } else {
                return response;
            }
        } else {
            return new Response("User does not exist", 404, {});
        }
    }

    static readModule(moduleCode, user) {
        const module = user.modules.find(
            (module) => module.moduleCode === moduleCode,
        );
        if (module) {
            return new Response("Module found", 200, module);
        } else {
            return new Response("Module does not exist", 404, {});
        }
    }

    static async readModuleByUserId(userId, moduleCode) {
        const user = await UserService.getUserInteral(userId);
        if (user) {
            let response = this.readModule(moduleCode, user);
            return response;
        } else {
            return new Response("User does not exist", 404, {});
        }
    }


    static editModuleName(moduleCode, newModuleName, user) {
        const module = user.modules.find(
            (module) => module.moduleCode === moduleCode,
        );
        if (module) {
            module.moduleName = newModuleName;
            return new Response("Module name updated successfully", 200, {});
        } else {
            return new Response("Module does not exist", 404, {});
        }
    }

    static editModuleCode(moduleCode, newModuleCode, user) {
        const module = user.modules.find(
            (module) => module.moduleCode === moduleCode,
        );
        if (module) {
            module.moduleCode = newModuleCode;
            return new Response("Module code updated successfully", 200, {});
        } else {
            return new Response("Module does not exist", 404, {});
        }
    }

    static editModuleCodeByUserId(userId, moduleCode, newModuleCode) {
        const user = UserService.getUserInteral(userId);
        if (user) {
            let response = this.editModuleCode(moduleCode, newModuleCode, user);
            if (response.code === 200) {
                user.save();
                return response;
            } else {
                return response;
            }
        } else {
            return new Response("User does not exist", 404, {});
        }
    }

    static editModuleStartDate(moduleCode, newStartDate, user) {
        const module = user.modules.find(
            (module) => module.moduleCode === moduleCode,
        );
        if (module) {
            module.startDate = newStartDate;
            return new Response("Module start date updated successfully", 200, {});
        } else {
            return new Response("Module does not exist", 404, {});
        }
    }

    static editModuleEndDate(moduleCode, newEndDate, user) {
        const module = user.modules.find(
            (module) => module.moduleCode === moduleCode,
        );
        if (module) {
            module.endDate = newEndDate;
            return new Response("Module end date updated successfully", 200, {});
        } else {
            resposneHandler.addError("Module does not exist", 404);
            return new Response("Module does not exist", 404, {});
        }
    }

    static async editModuleEndDateByUserId(userId, moduleCode, newEndDate) {
        const user = await UserService.getUserInternal(userId);
        if (user) {
            let response = this.editModuleEndDate(moduleCode, newEndDate, user);
            if (response.code === 200) {
                user.save();
                return response;
            } else {
                return response;
            }
        } else {
            return new Response("User does not exist", 404, {});
        }
    }
    static deleteModule(moduleCode, user) {
        const module = user.modules.find(
            (module) => module.moduleCode === moduleCode,
        );
        if (module) {
            return new Response("Module deleted successfully", 200, {});
        } else {
            return new Response("Module does not exist", 404, {});
        }
    }


    static async deleteModuleByUserId(userId, moduleCode) {
        const user = await UserService.getUserInternal(userId);
        if (user) {
            let response = this.deleteModule(moduleCode, user);
            if (response.code === 200) {
                user.save();
                return response;
            } else {
                return response;
            }
        } else {
            return new Response("User does not exist", 404, {});
        }
    }

}


userSchema.loadClass(ModuleService);
const Module = model("Module", userSchema);

export default Module;
