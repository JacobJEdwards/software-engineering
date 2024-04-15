
import mongoose from "mongoose";
const { Schema } = mongoose;
const activitySchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    tasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }],
    activityTitle: { type: String, required: true },
    activityType: { type: String, required: true },
    notes: { type: String },
    hrsCompleted: { type: Number, required: true, default: 0 },
}, { timestamps: true });

export default activitySchema;
