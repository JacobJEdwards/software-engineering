import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const {Schema, model} = mongoose;

const userSchema = new Schema({
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    milestones: [{ type: Schema.Types.ObjectId, ref: 'Milestone' }]
}, { timestamps: true });

class UserModel {
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
}

userSchema.loadClass(UserModel);
const User = model('User', userSchema); // Changed 'UserModel' to 'User' for clarity
export default User;
