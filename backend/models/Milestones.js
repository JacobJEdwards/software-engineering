// Milestones.js
import mongoose from "mongoose";

const { Schema } = mongoose;

const taskSchema = new Schema({
    name: { type: String, required: true },
    dueDate: { type: Date },
    status: { type: String, enum: ['Pending', 'InProgress', 'Completed'] },
}, { timestamps: true });

const milestoneSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    milestoneType: { type: String, required: true },
    tasks: [taskSchema],
    deadline: { type: Date },
}, { timestamps: true });

milestoneSchema.index({ userId: 1 });

const Milestone = mongoose.model('Milestone', milestoneSchema);

export default Milestone;
