import bcrypt from "bcryptjs";
import userSchema from "../models/User.js";
import {model} from "mongoose";
import Module from "../service/ModuleService.js";
import Semester from "../service/SemesterService.js";

class ImportService {
    static async addFileData(file, user_id) {

        for (let element of file) {
            const semester = {
                semesterName: element.Semester,
                modules: [],
            }

            Semester.addSemester(element.Semester, user_id);


            const module = {
                moduleCode: element.ModuleCode,
                moduleName: element.ModuleName,
                startDate: Date.now(),
            };
            Module.addModule(element.Semester, module, user_id);

        }
    }
}



userSchema.loadClass(ImportService);
const Import = model('import', userSchema);

export default Import;
