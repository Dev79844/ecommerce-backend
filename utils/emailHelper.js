const nodemailer = require('nodemailer')

const mailHelper = async(options) => {
    const transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS
        }
      });

      const message = {
        from: 'parikhdev6@gmail.com', // sender address
        to: options.email, // list of receivers
        subject: options.subject, // Subject line
        text: options.message, // plain text body
      }
    
      // send mail with defined transport object
      await transporter.sendMail(message);
}

module.exports = mailHelper