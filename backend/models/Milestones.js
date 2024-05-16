import mongoose from "mongoose";
import taskSchema from "./Tasks.js";

const { Schema } = mongoose;
const milestoneSchema = new Schema({
    milestoneTitle: { type: String, required: true },
    milestoneType: { type: String, required: true },
    ltsDefined: { type: Boolean, required: true, default: false },
    tasks: [taskSchema],
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
}, { timestamps: true });

export default milestoneSchema;
