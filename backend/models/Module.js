// Module.js
import mongoose from 'mongoose';
import milestones from "./Milestones.js";

const {Schema, model} = mongoose;

const moduleSchema = new Schema({
    moduleName: {type: String, required: true},
    milestones: [milestones],
    startDate: {type: Date},
    endDate: {type: Date},
}, {timestamps: true});


export default moduleSchema
