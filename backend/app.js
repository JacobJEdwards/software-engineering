import express from 'express';
import AuthMiddleware from "./middleware/AuthMiddleware.js"
import  AuthRoutes from "./routes/AuthRoutes.js";
import mongoose from 'mongoose';


mongoose.connect(mongoDBUri, )
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

const app = express();
app.use(express.json());
const authRoutes = new AuthRoutes(); // Instantiate AuthRoutes
const PORT = 3000;
app.use('/api/protected', AuthMiddleware.authenticate, (req, res) => {
    res.json({ message: 'This is a protected route' });
});

app.use('/api/auth', authRoutes.router);

app.get("/", (req, res) => {
    res.json("hello world");
})

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));