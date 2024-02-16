import cron from 'node-cron';
import path from "path";
import fs from "fs";
import {fileURLToPath} from "url";



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
class CronJobsSetup {
    constructor(timezone = "Europe/London") {
        this.jobs = [];
        this.timezone = timezone;
        this.setupJobs();
    }

    addJob(name, schedule, task) {
        if (this.jobs.some(job => job.name === name)) {
            console.error(`A job named "${name}" already exists.`);
            return;
        }

        const job = cron.schedule(schedule, task, {
            scheduled: false,
            timezone: this.timezone
        });

        this.jobs.push({ name, job });
        console.log(`Added job "${name}" with schedule "${schedule}".`);
    }

    startAllJobs() {
        this.jobs.forEach(job => {
            job.job.start();
            console.log(`Job "${job.name}" started.`);
        });
    }

    setupJobs() {
        const directoryPath = path.join(__dirname, 'tempUploads');
        this.addJob('cleanup', '0 0 * * *', () => {
            const now = Date.now();
            fs.readdir(directoryPath, (err, files) => {
                if (err) throw err;

                files.forEach(file => {
                    const filePath = path.join(directoryPath, file);
                    fs.stat(filePath, (err, stats) => {
                        if (err) throw err;

                        // Check if the file is older than 24 hours
                        if (now - stats.mtime.getTime() > 24 * 60 * 60 * 1000) { // 24 * 60 * 60 * 1000 ms = 24 hours
                            fs.unlink(filePath, err => {
                                if (err) throw err;
                                console.log(`Deleted old file: ${file}`);
                            });
                        }
                    });
                });
            });
        });
    }
}

export default CronJobsSetup;
