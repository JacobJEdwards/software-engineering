import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const moduleSchema = new Schema({
    moduleName: { type: String, required: true },
    work: {
        milestones: [{ type: Schema.Types.ObjectId, ref: 'Milestone' }],
        tasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }]
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true }
}, { timestamps: true });

const Module = model('Module', moduleSchema);

export default Module;
