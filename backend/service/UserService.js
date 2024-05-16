import bcrypt from "bcryptjs";
import userSchema from "../models/User.js";
import {model} from "mongoose";
import Response from "../utils/Response.js";
import Mailer from "../middleware/Mailer.js";

class UserService {
    static async createUser(email, name, password) {
        const hashedPassword = await bcrypt.hash(password, 12);
        const authCode = await bcrypt.hash(email, 12);

        try {
        const user = await new this({email: email, name: name, password: hashedPassword, auth:false, authCode: authCode});
            try {
                await user.save();
                let mail = await Mailer.emailUserVerification(user, authCode);
                return new Response("User created successfully", 200,
                );
            } catch (e) {
                return new Response("User Unsuccessful", 400, e)
            }
        } catch (e) {
            return new Response("User already exists", 400, e);
        }
    }

    static async authenticateUser(email, password) {
        let user = await this.findOne({email});
        if (user && (await bcrypt.compare(password, user.password) && user.auth)) {
            user = user.toObject();
            delete user.password;
            return new Response("User authenticated", 200, user);
        } else {
            return new Response("Invalid email or password", 404, {});
        }
    }

    static async getUserByEmail(email) {
        return await this.findOne({email});
    }

    static async getUserById(userId) {
        let user = await this.findById(userId);
        if (user) {
            delete user.password;
            return new Response("User found", 200, user);
        } else {
            return new Response("User does not exist", 404, {});
        }
    }

    static async getUserInternal(userId) {
        try {
            return await this.findById(userId);
        } catch (err) {
            return null;
        }
    }

    static async updateUser(userId, email, name, password) {
        const user = await this.findById(userId);
        user.email = email;
        user.name = name;
        user.password = password;
        await user.save();
        return new Response("User updated successfully", 200, {});
    }


    static async addCurrentSemester(userId, currentSemester) {
        const user = await this.findById(userId);
        let update = user.semester.forEach(semester => {
            if (semester._id.valueOf() == currentSemester.valueOf()) {
                user.currentSemester = semester
            }
        });

        if (update !== null) {
            await user.save();
            return new Response("User Successfully Updated", 200, {});
        }
        return new Response("Semester does not exist", 404, {});
    }

    static async deleteUser(userId) {
        try {
            await this.findByIdAndDelete(userId);
            return new Response("User deleted successfully", 200, {});
        } catch (err) {
            return new Response("User does not exist", 404, err.message);
        }
    }


    static async getUsers() {
        try {
            let db = await this.getSiblingDB("admin");
            let dbs = db.runCommand({"listDatabases": 1}).databases;
            dbs.forEach(function (database) {
                db = db.getSiblingDB(database.name);
                let cols = db.getCollectionNames();
                cols.forEach(function (col) {
                    console.log(col)
                });
            });
        } catch (e) {
            console.log(e)
        }
    }
}

userSchema.loadClass(UserService);
const User = model("User", userSchema);

export default User;
