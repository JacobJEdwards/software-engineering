import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Semester from './Semesters.js';

const {Schema, model} = mongoose;

const userSchema = new Schema({
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    currentSemester : {type: Schema.Types.ObjectId, ref: 'Semester'},
    auth: { type: Boolean, default: false },
    semester: [Semester]
}, { timestamps: true });


export default userSchema


