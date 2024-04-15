import mongoose from "mongoose";

const { Schema } = mongoose;

const unAuthedUser = new Schema({
    email: { type: String, required: true, unique: true },
    key: { type: String, required: true, unique: true },
}, { timestamps: true });


export default unAuthedUser;


