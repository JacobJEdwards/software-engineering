const formData = import('form-data');
import Mailgun from 'mailgun.js';

export class Mailer {


    mail() {
        let mailgun = new Mailgun(FormData);
        let mg = mailgun.client({username: 'api', key: process.env.MAILGUN_API_KEY})
        mg.messages.create('sandboxee68d2e4ff994022aede1eafabe50a5e.mailgun.org', {
            from: "Wonderful Tasks <wonderfultasks@sandboxee68d2e4ff994022aede1eafabe50a5e.mailgun.org>",
            to: ["jacobjedwards@gmail.com"],
            subject: "Hello",
            text: "<Jamie is cooler than you>",
            html: "<h1> honestly though </h1>"
        }).then(msg => console.log(msg)).catch(err => console.error(err));
    }

}


export default Mailer;