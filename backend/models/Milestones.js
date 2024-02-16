// Milestones.js
import mongoose from "mongoose";
import taskSchema from "./Tasks.js";

const { Schema } = mongoose;
const milestoneSchema = new Schema({
    name: { type: String, required: true },
    milestoneType: { type: String, required: true },
    tasks: [taskSchema],
    deadline: { type: Date },
}, { timestamps: true });

export default milestoneSchema;
