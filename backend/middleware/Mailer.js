const formData = import('form-data');
import Mailgun from 'mailgun.js';

export class Mailer {


   static mail() {
        let mailgun = new Mailgun(FormData);
        let mg = mailgun.client({username: 'api', key: process.env.MAILGUN_API_KEY})
        mg.messages.create('wonderfultasks.me', {
            from: "Wonderful Tasks <mail@wondefultasks.me>",
            to: ["jjwales38@gmail.com"],
            subject: "Hello",
            text: "<Jamie is cooler than you>",
            html: "<h1> honestly though </h1>"
        }).then(msg => console.log(msg)).catch(err => console.error(err));
    }

}


export default Mailer;