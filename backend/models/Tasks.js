// Task.js
import mongoose from 'mongoose';

const { Schema, model } = mongoose;

// Task Schema
const taskSchema = new Schema({
    name: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: { type: String, required: true, enum: ['Started', 'In Progress', 'Completed'] },
    notes: [{
        date: { type: Date, default: Date.now },
        content: { type: String }
    }]
}, { timestamps: true });

const Task = model('Task', taskSchema);

export default Task;