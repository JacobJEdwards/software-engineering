// Task.js
import mongoose from 'mongoose';

const { Schema, model } = mongoose;

// Task Schema
const taskSchema = new Schema({
    name: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: { type: String, required: true, enum: ['Started', 'In Progress', 'Completed'] },
    hours: { type: Number, required: true },
    activities: { type: mongoose.Types.ObjectId, required: true },
}, { timestamps: true });


export default taskSchema;
