import csv from 'fast-csv';
import fs from 'fs';
import Validator from "../middleware/Validator.js";
import jwt from "jsonwebtoken";
import ImportService from "../service/ImportService.js";

export class ImportController {

    static async fileUpload(req, res) {

        const file = req.file;
        if (!file) {
            return res.status(400).json({ message: "Please upload a file!" });
        }
        try {
            let output = [];
            let readStream = fs.createReadStream(file.path).pipe(csv.parse({ headers: true })).on('data', (row) => {
                output.push(row);
            });

            readStream.on('end', async () => {
                fs.unlinkSync(file.path);
                try {
                    await Validator.validateFile(output);
                } catch (e) {
                    return res.status(400).json({ message: e.message });
                }
                const token = req.headers.authorization;
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                console.log(decoded.userId);

                let response = await ImportService.addFileData(output, decoded.userId);
                return res.status(response.code).json({ message: response.message });
            });

        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

}
export default ImportController
