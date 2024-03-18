import express from 'express';
import cors from "cors"
import AuthMiddleware from "./middleware/AuthMiddleware.js"
import  AuthRoutes from "./routes/AuthRoutes.js";
import mongoose from 'mongoose';
import dotenv from "dotenv";
import User from "./service/UserService.js";
import ImportRoutes from "./routes/ImportRoutes.js";
import CronJob from './utils/CronJobSetup.js';
import UserRoutes from "./routes/userRoutes.js";
import user from "./models/User.js";
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
const authRoutes = new AuthRoutes();
const importRoutes = new ImportRoutes();
const userRoutes = new UserRoutes();
const PORT = 3000;

app.use('/api/protected', AuthMiddleware.authenticate, authRoutes.router);

app.use('/api/protected', AuthMiddleware.authenticate, importRoutes.router);

app.use('/api/protected', AuthMiddleware.authenticate, userRoutes.router);
app.use('/api/protected/test', (req, res) => {
    const users = User.getUserByEmail('testu@test.com').then((user) => {

        res.status(200).send(user);
    })
})
app.use('/api/auth', authRoutes.router)

// error api route
app.all('/api', (err, req, res, next) => {
    console.error(err)
    req.status(400).json({})
})

// not found api route
app.all("/api", (req, res, next) => {
    req.status(404).json({})
})

// everything else is frontend
//app.all("*", (req, res) => {
 //   req.sendFile("../client/dist/index.html")
//})

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
