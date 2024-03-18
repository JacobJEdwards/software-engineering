import csv from 'fast-csv';
import fs from 'fs';
import Validator from "../middleware/Validator.js";
import jwt from "jsonwebtoken";
import ImportService from "../service/ImportService.js";

export class ImportController {

    static async fileUpload(req, res) {

        try {
            const file = req.file;
            console.log(req.from);
            let output = [];
            let readStream = await fs.createReadStream(file.path).pipe(csv.parse({headers: true})).on('data', (row) => {
                output.push(row);
            });

            readStream.on('end', async () => {
                await fs.unlinkSync(file.path);
                try {
                    await Validator.validateFile(output);
                } catch (e) {
                    return res.status(400).json({message: e.message});
                }
                const token = req.headers.authorization;
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                ImportService.addFileData(output, decoded.userId);
                return res.status(201).json({message: "File uploaded successfully"});
            });

        } catch (error) {
            return res.status(500).json({message: error.message});
        }
    }

}
export default ImportController