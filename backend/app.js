import dotenv from "dotenv";
import Application from "./Application.js";
dotenv.config({ path: "../.env",  });
const app = new Application(3001, 'mongodb://localhost:27017/wonderfultasksdb' );
app.start();
