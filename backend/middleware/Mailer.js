import formData from "form-data";
import Mailgun from "mailgun.js";
import User from "../service/UserService.js";
import Tasks from "../service/TaskService.js";
import mongoose from "mongoose";

class Mailer {
  static async emailUserVerification(user, token) {
    try {
      await mongoose.connect(process.env.MONGODB_URI);
      let mailgun = new Mailgun(formData);
      let mg = mailgun.client({
        username: "api",
        key: process.env.MAILGUN_API_KEY,
      });
      const emailData = {
        from: "Excited User <mail@wonderfultasks.me>",
        to: [user.email],
        subject: "Please verify your account",
        text: `Dear ${user.name}, please verify your account at the following URL: localhost:5173/verify?userId=${user._id}&token=${token}`,
        html: `<p>Dear ${user.name},</p><p>Please verify your account at <a href="http://localhost:5173/verify?userId=${user._id}&token=${token}">this link</a>.</p>`,
      };

      await mg.messages
        .create("wonderfultasks.me", emailData)
        .then((msg) => console.log(`Email sent to ${user.email}`))
        .catch((err) =>
          console.log(`Failed to send email to ${user.email}: ${err.message}`),
        );
      return true;
    } catch (error) {
      console.error(`Error: ${error.message}`);
    }
  }

  static async upcomingTasks() {
    try {
      await mongoose.connect(process.env.MONGODB_URI);
      let mailgun = new Mailgun(formData);
      let mg = mailgun.client({
        username: "api",
        key: process.env.MAILGUN_API_KEY,
      });
      const users = await User.find({}); // Assuming each user should receive a notification

      for (const user of users) {
        let tasks = await Tasks.upcomingDeadline(
          user._id.valueOf(),
          String(Date.now() + 5 * 24 * 60 * 60 * 1000),
        );
        if (tasks.code === 200) {
          const taskList = tasks.data
            .map((task) => `<li>${task.name} - Due: ${task.deadline}</li>`)
            .join("");
          const emailData = {
            from: "Excited User <mail@wonderfultasks.me>",
            to: [user.email],
            subject: "Upcoming Task Deadline",
            text: `Dear ${user.name}, the following tasks are now due: ${tasks.data.map((task) => task.name).join(", ")}`,
            html: `<p>Dear ${user.name},</p><p>The following tasks are due in five days:</p><ul>${taskList}</ul><p>Please ensure they are completed on time.</p>`,
          };

          await mg.messages
            .create("wonderfultasks.me", emailData)
            .then((msg) => console.log(`Email sent to ${user.email}`))
            .catch((err) =>
              console.log(
                `Failed to send email to ${user.email}: ${err.message}`,
              ),
            );
        }
      }
    } catch (error) {
      console.error(`Error: ${error.message}`);
    }
  }
}

export default Mailer;
