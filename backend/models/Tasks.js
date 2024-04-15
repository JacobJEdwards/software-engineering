// Task.js
import mongoose from 'mongoose';

const { Schema } = mongoose;

const taskSchema = new Schema({
    title: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: { type: String, required: true, enum: ['Started', 'In Progress', 'Completed'] },
    hrsCompleted: { type: Number, required: true, default: 0 },
    hrsRequired: { type: Number, required: true },
    activities: { type: mongoose.Types.ObjectId, required: true },
}, { timestamps: true });


export default taskSchema;
