const express = require('express');
const UserRoutes = require('./routes/userRoutes');


const app = express();
const PORT = 3000;

app.use(express.json());
app.use('/users', UserRoutes);
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT`));
