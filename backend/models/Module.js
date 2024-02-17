// Module.js
import mongoose from 'mongoose';
import milestones from "./Milestones.js";

const {Schema, model} = mongoose;

const moduleSchema = new Schema({
    moduleName: {type: String, required: true},
    moduleCode: {type: String, required: true, unique: true},
    milestones: [milestones],
    startDate: {type: Date},
    endDate: {type: Date},
}, {timestamps: true, unique: true});


export default moduleSchema
