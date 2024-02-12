import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const semesterSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    semesterName: { type: String, required: true },
    modules: [{ type: Schema.Types.ObjectId, ref: 'Module' }]
}, { timestamps: true });

const Semester = model('Semester', semesterSchema);

export default Semester;
