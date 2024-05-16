import formData from 'form-data';
import Mailgun from 'mailgun.js';
import User from '../service/UserService.js';
import Tasks from '../service/TaskService.js';
import mongoose from 'mongoose';

class Mailer {
    static async emailUserVerification(id, url) {
        try {
            await mongoose.connect(process.env.MONGODB_URI, {
                useNewUrlParser: true, useUnifiedTopology: true,
            });
            let mailgun = new Mailgun(formData);
            let mg = mailgun.client({username: 'api', key: process.env.MAILGUN_API_KEY});
            const users = await User.find({}); // Assuming each user should receive a notification
            for (const user of users) {
                let tasks = await Tasks.upcomingDeadline(user._id.valueOf(), String(Date.now() + 5));
                if (tasks.code === 200) {
                    console.log(tasks.data)
                    await mg.messages.create('wonderfultasks.me', {
                        from: "Excited User <mail@wonderfultasks.me>",
                        to: [user.email],
                        subject: "Please verify your account",
                        text: "Dear `${user.name}`, please verify your account at the following URL",
                        html: `<p>Dear ${user.name},</p><p>please verify your account at localhost:3000/verify?userid=${id}?token=${url}`
                    })
                        .then(msg => console.log("Email sent to `${user.email}`"))
                        .catch(err => console.log(`Failed to send email to ${user.email}`));
                }
            }
        } catch (error) {
            console.error(`Error: ${error}`);
        } finally {
            await mongoose.connection.close();
        }
    }
    static async upcomingTasks() {
        try {
            await mongoose.connect(process.env.MONGODB_URI, {
                useNewUrlParser: true, useUnifiedTopology: true,
            });
            let mailgun = new Mailgun(formData);
            let mg = mailgun.client({username: 'api', key: process.env.MAILGUN_API_KEY});
            const users = await User.find({}); // Assuming each user should receive a notification
            for (const user of users) {
                let tasks = await Tasks.upcomingDeadline(user._id.valueOf(), String(Date.now() + 5));
                if (tasks.code === 200) {
                    console.log(tasks.data)
                    await mg.messages.create('wonderfultasks.me', {
                        from: "Excited User <mail@wonderfultasks.me>",
                        to: [user.email],
                        subject: "Upcoming Task Deadline",
                        text: `Dear ${user.name}, the task the following tasks are now due ${tasks}`,
                        html: `<p>Dear ${user.name},</p><p>The tasks <strong>"${tasks}"</strong> is due in five days. Please ensure it is completed on time.</p>`
                    })
                        .then(msg => console.log(`Email sent to ${user.email}`))
                        .catch(err => console.log(`Failed to send email to ${user.email}`));
                }
            }
        } catch (error) {
            console.error(`Error: ${error}`);
        } finally {
            await mongoose.connection.close();
        }
    }
}

export default Mailer;
