import bcrypt from "bcryptjs";
import userSchema from "../models/User.js";
import {model} from "mongoose";

class UserService {
    static async createUser(email, name, password) {
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new this({email, name, password: hashedPassword});
        try {
            await user.save();
            return user;
        } catch (error) {
            throw new Error('User creation failed: ' + error.message);
        }
    }

    static async authenticateUser(email, password) {
        const user = await this.findOne({email});
        if (user && await bcrypt.compare(password, user.password)) {
            return user;
        } else {
            throw new Error('Authentication failed');
        }
    }


    static getUserByEmail(email) {
        return this.findOne({email});
    }


    static getUserById(userId) {
        return this.findById(userId);
    }

    static async updateUser(userId, email, name, password) {
        const user = await this.findById(userId);
        user.email = email;
        user.name = name;
        user.password = password;
        await user.save();
    }

    static async deleteUser(userId) {
        await this.findByIdAndDelete(userId);
    }
}
userSchema.loadClass(UserService);
const User = model('User', userSchema);

export default User;
