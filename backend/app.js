import express from 'express';
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

User.getUserByEmail('testu@test.com').then((user) => {
    console.log(user);
})
mongoose.connect(mongoDBUri, )
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));


const app = express();
app.use(express.json());
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
