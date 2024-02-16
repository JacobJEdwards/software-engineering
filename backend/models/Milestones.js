// Milestones.js
import mongoose from "mongoose";
import taskSchema from "./Tasks.js";

const { Schema } = mongoose;
const milestoneSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    milestoneType: { type: String, required: true },
    tasks: [taskSchema],
    deadline: { type: Date },
}, { timestamps: true });

export default milestoneSchema;
