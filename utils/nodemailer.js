const nodemailer = require('nodemailer');
const sendEmail = async (options) => {
  //create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,

    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
      method: 'PLAIN',
    },
  });

  // define email options
  const mailOptions = {
    from: 'Kartik Sharma <kartik@harma.io>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  //actually send the email
  try {
    await transporter.sendMail(mailOptions);
    console.log('email send succesfully');
  } catch (err) {
    console.log('error semding mail' + err);
  }
};
module.exports = sendEmail;
