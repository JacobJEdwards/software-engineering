import express from 'express';
import ImportController from '../controllers/importController.js';
import upload from '../middleware/FileUploadConfig.js';
class ImportRoutes {
    constructor() {
        this.router = express.Router();
        this.registerRoutes();
    }

    registerRoutes() {
        this.router.post('/upload', upload.single('file'), ImportController.fileUpload);
        this.router.post('/generate-csv', ImportController.generateCSV);
    }
}


export default ImportRoutes;

