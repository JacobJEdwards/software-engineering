import bcrypt from "bcryptjs";
import userSchema from "../models/User.js";
import {model} from "mongoose";
import user from "../models/User.js";

class ImportService {
    static async addFileData(file, user_id) {
        return console.log(file, user_id);
    }
}


userSchema.loadClass(ImportService);
const Import = model('import', userSchema);

export default Import;
