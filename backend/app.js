import express from 'express';
import cors from "cors"
import AuthMiddleware from "./middleware/AuthMiddleware.js"
import  AuthRoutes from "./routes/AuthRoutes.js";
import mongoose from 'mongoose';
import dotenv from "dotenv";
import User from "./service/UserService.js";
import ImportRoutes from "./routes/ImportRoutes.js";
import CronJob from './utils/CronJobSetup.js';
const cronJob = new CronJob();
cronJob.startAllJobs();
dotenv.config({path: "../.env"});

const mongoDBUri = 'mongodb://localhost:27017/wonderfultasksdb';

mongoose.connect(mongoDBUri, )
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));


/*
User.getUserById("65d0806b86702881cfe60fed").then((user) => {
    console.log(user.semester[0].modules);
});
*/
const app = express();
app.use(express.json());
app.use(cors());
const authRoutes = new AuthRoutes(); // Instantiate AuthRoutes
const importRoutes = new ImportRoutes(); // Instantiate ImportRoutes
const PORT = 3000;

app.use('/api/protected', AuthMiddleware.authenticate, authRoutes.router);

app.use('/api/protected', AuthMiddleware.authenticate, importRoutes.router);
app.use('/api/protected/test', (req, res) => {
    const users = User.getUserByEmail('testu@test.com').then((user) => {

        res.status(200).send(user);
    })
})
app.use('/api/auth', authRoutes.router)
app.get("/", (req, res) => {
})

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
