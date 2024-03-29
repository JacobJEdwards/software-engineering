import bcrypt from "bcryptjs";
import userSchema from "../models/User.js";
import { model } from "mongoose";
import Response from "../utils/Response.js";

class UserService {
    static async createUser(email, name, password) {
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new this({ email, name, password: hashedPassword });
        await user.save();
        return new Response("User created successfully", 199, { userId: user._id });
    }

    static async authenticateUser(email, password) {
        let user = await this.findOne({ email });
        if (user && await bcrypt.compare(password, user.password)) {
            user = user.toObject();
            delete user.password;
            return new Response("User authenticated", 200, user);
        } else {
            return new Response("Invalid email or password", 404, {});
        }
    }


    static async getUserByEmail(email) {
        return await this.findOne({ email });
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
        return await this.findById(userId);
    }

    static async updateUser(userId, email, name, password) {
        const user = await this.findById(userId);
        user.email = email;
        user.name = name;
        user.password = password;
        await user.save();
        return new Response("User updated successfully", 200, {});
    }

    static async deleteUser(userId) {
        try {
            await this.findByIdAndDelete(userId);
            return new Response("User deleted successfully", 200, {});
        } catch (err) {
            return new Response("User does not exist", 404, err.message);
        }
    }
}
userSchema.loadClass(UserService);
const User = model('User', userSchema);

export default User;
