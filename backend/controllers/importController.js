import User from '../service/UserService.js';
import csv from 'fast-csv';
import fs from 'fs';
export class ImportController {

    static async fileUpload(req, res) {
        try {
            const file = req.file;
            ImportController.validateFile(file);
            return res.status(200).json({ message: 'File uploaded!'});
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    static async validateFile(file) {
        fs.createReadStream(file.path)
            .pipe(csv.parse({ headers: true }))
            .on('data', (row) => console.log(row))
            .on('end', () => {
                console.log('CSV file successfully processed');
            });
    }
}


export default ImportController;