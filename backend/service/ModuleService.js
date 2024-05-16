import userSchema from "../models/User.js";
import {model} from "mongoose";
import Response from "../utils/Response.js";
import UserService from "./UserService.js";
import Validator from "../middleware/Validator.js";

class ModuleService {
    static async createModule(semesterName, moduleName, moduleCode, moduleStartDate, moduleEndDate, user) {
        const semesterExists = user.semester.find((semesterObject) => semesterObject.semesterName === semesterName);
        if (semesterExists) {
            const newModule = {
                moduleName: moduleName,
                moduleCode: moduleCode,
                milestones: [],
                startDate: moduleStartDate,
                endDate: moduleEndDate,
            };
            let response = await Validator.validateModule(newModule);
            if (response.code !== 200) {
                return response
            }
            const moduleExists = user.semester
                .find((semester) => semester.semesterName === semesterName)
                .modules.find((module) => module.moduleCode === moduleCode);

            if (!moduleExists) {
                user.semester
                    .find((semester) => semester.semesterName === semesterName)
                    .modules.push(newModule);
                return new Response("Module created successfully", 200, {});
            } else {
                return new Response("Module already exists", 404, {});
            }
        }
    }


    static async createModuleByUserId(userId, semesterName, moduleName, moduleCode, moduleStartDate, moduleEndDate) {
        const user = UserService.getUserInternal(userId);
        if (user) {
            let response = await this.createModule(semesterName, moduleName, moduleCode, moduleStartDate, moduleEndDate, user);
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

    static async readModule(user, moduleCode) {
        let response = await Validator.validateModule(null, moduleCode, null, null);
        if (response.code !== 200) return response;
        const module = user.semester.find(semester => semester.modules.find(module => module.moduleCode === moduleCode));
        if (module) {
            return new Response("Module found", 200, module);
        } else {
            return new Response("Module does not exist", 404, {});
        }
    }

    static async readModuleByUserId(userId, moduleCode) {
        let response = await Validator.validateModule(null, moduleCode, null, null);
        if (response.code !== 200) return response;
        response = await Validator.validateUser(userId, null, null, null);
        if (response.code !== 200) return response;

        const user = await UserService.getUserInteral(userId);
        if (user) {
            let response = this.readModule(moduleCode, user);
            return response;
        } else {
            return new Response("User does not exist", 404, {});
        }
    }


    static async editModule(moduleCode, newModuleName, newModuleCode, newStartDate, newEndDate, user) {
        const module = user.semester.find(semester => semester.modules.find(module => module.moduleCode === moduleCode));
        if (module) {
            module.moduleName = newModuleName == null ? module.moduleName : newModuleName;
            module.moduleCode = newModuleCode == null ? module.moduleCode : newModuleCode;
            module.startDate = newStartDate == null ? module.startDate : newStartDate;
            module.endDate = newEndDate == null ? module.endDate : newEndDate;
            return await Validator.validateModule(module);
        } else {
            return new Response("Module does not exist", 404, {});
        }
    };


    static async editModuleName(moduleCode, newModuleName, user) {
        const module = user.modules.find((module) => module.moduleCode === moduleCode,);
        if (module) {
            module.moduleName = newModuleName;
            return await Validator.validateModule(module);
        } else {
            return new Response("Module does not exist", 404, {});
        }
    }

    static async editModuleCode(moduleCode, newModuleCode, user) {
        const module = user.modules.find((module) => module.moduleCode === moduleCode,);
        if (module) {
            module.moduleCode = newModuleCode;
            return await Validator.validateModule(module);
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

    static async editModuleStartDate(moduleCode, newStartDate, user) {
        const module = user.modules.find((module) => module.moduleCode === moduleCode,);
        if (module) {
            module.startDate = newStartDate;
            return await Validator.validateModule(module);
        } else {
            return new Response("Module does not exist", 404, {});
        }
    }

    static async editModuleEndDate(moduleCode, newEndDate, user) {
        const module = user.modules.find((module) => module.moduleCode === moduleCode,);
        if (module) {
            module.endDate = newEndDate;
            return await Validator.validateModule(module);
        } else {
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

    static deleteModule(moduleCode, semesterName, user) {
        user.semester
            .find((semester) => {
                if (semester.semesterName === semesterName) {
                    semester.modules.find((module) => {
                        if (module.moduleCode === moduleCode) {
                            semester.modules.pull(module);
                            return new Response("Module delete", 200, {});
                        }
                    })
                }
            });

        return new Response("Module not found", 404, {});
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


userSchema
    .loadClass(ModuleService);

const Module = model("Module", userSchema);

export default Module;
