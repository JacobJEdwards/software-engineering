import dotenv from "dotenv";
import Application from "./Application.js";
dotenv.config({ path: "../.env",  });
const app = new Application(3000, process.env.MONGODB_URI);
app.start();
