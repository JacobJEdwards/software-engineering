// Module.js
import mongoose from 'mongoose';
import milestones from "./Milestones.js";

const { Schema } = mongoose;

const moduleSchema = new Schema({
    moduleName: { type: String, required: true },
    moduleCode: { type: String, required: true },
    milestones: [milestones],
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
}, { timestamps: true });


export default moduleSchema
