const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SEND_GRID_API_KEY);

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