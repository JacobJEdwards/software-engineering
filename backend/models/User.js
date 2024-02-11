import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const { Schema, model } = mongoose;

const userSchema = new Schema({
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
});

class UserModel {
    static async createUser(email, name, password) {
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new this({ email, name, password: hashedPassword });
        console.log("workding");
        return user.save();
    }

    static async authenticateUser(email, password) {
        const user = await this.findOne({ email });
        if (user && await bcrypt.compare(password, user.password)) {
            return user;
        } else {
            return null;
        }
    }
}

userSchema.loadClass(UserModel);
const User = model('User', userSchema); // Changed 'UserModel' to 'User' for clarity
export default User;
