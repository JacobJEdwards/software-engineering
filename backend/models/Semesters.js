import mongoose from 'mongoose';
import moduleSchema from "./Module.js";
const { Schema } = mongoose;

const semesterSchema = new Schema({
    semesterName: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    modules: [moduleSchema],
}, { timestamps: true, unique: true });


export default semesterSchema;
