const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Muhammad Gamal ${process.env.EMAIL_FROM}`;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      return nodemailer.createTransport({
        host: process.env.TURBOSMTP_SERVER,
        port: process.env.TURBOSMTP_PORT,
        auth: {
          user: process.env.TURBOSMTP_USERNAME,
          pass: process.env.TURBOSMTP_PASSWORD
        }
      });
    }
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  async send(templete, subject) {
    //1 - Render HTML based on pug template
    const html = pug.renderFile(
      `${__dirname}/../views/emails/${templete}.pug`,
      {
        firstName: this.firstName,
        url: this.url,
        subject
      }
    );

    //2- define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.fromString(html)
    };

    //3- Create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'welcome to the Natours Family!');
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset token (valid for 10 minutes'
    );
  }
};

/*const sendEmail = async options => {
  //1) create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  });
  //2) define the email options
  const mailOptions = {
    from: 'muhammad Gamal <moga1478@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message
    // html:
  };
  //3) Actually send the email
  await transporter.sendMail(mailOptions);
};
// module.exports = sendEmail;
module.exports = sendEmail;*/
