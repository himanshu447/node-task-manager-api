const sendGridApiKey = process.env.SENDGRIDAPIKEY;
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(sendGridApiKey);

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'abc@gmail.com',
        subject: 'Welcome to Task Application',
        test: `${name} Welcome to the Task applucation`,
    });
}

module.exports = {
    sendWelcomeEmail,
}