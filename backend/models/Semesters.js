import mongoose from 'mongoose';
import moduleSchema from "./Module.js";
const { Schema, model } = mongoose;

const semesterSchema = new Schema({
    semesterName: { type: String, required: true},
    modules: [moduleSchema],
}, { timestamps: true , unique: true});


export default semesterSchema;
