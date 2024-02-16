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
    }
}


export default ImportRoutes;

