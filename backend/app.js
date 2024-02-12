import express from 'express';
import AuthMiddleware from "./middleware/AuthMiddleware.js"
import  AuthRoutes from "./routes/AuthRoutes.js";
import mongoose from 'mongoose';
import dotenv from "dotenv";

dotenv.config({path: "../.env"});

const mongoDBUri = 'mongodb://localhost:27017/wonderfultasksdb';

mongoose.connect(mongoDBUri, )
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

const app = express();
app.use(express.json());
const authRoutes = new AuthRoutes(); // Instantiate AuthRoutes
const PORT = 3000;

app.use('/api/protected', AuthMiddleware.authenticate, authRoutes.router);

app.use('/api/protected/test', (req, res) => {
    res.json("testing");
})
app.use('/api/auth', authRoutes.router)
app.get("/", (req, res) => {
    res.json("hello world");
})

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));