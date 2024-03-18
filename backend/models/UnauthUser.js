import mongoose from "mongoose";
import Semester from "./Semesters.js";

const {Schema, model} = mongoose;

const unAuthedUser= new Schema({
    email: { type: String, required: true, unique: true },
    key: { type: String, required: true, unique: true },
}, { timestamps: true });


export default unAuthedUser;


