const nodemailer = require("nodemailer");

const transport = {
  service: "gmail",
  auth: {
    user: "mancunian203@gmail.com",
    pass: process.env.APP_PASSWORD,
  },
};

const transporter = nodemailer.createTransport(transport);

const sendEmail = async (to, subject, html) => {
  const mailOptions = {
    from: transport.auth.user,
    to,
    subject,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log(error);
  }
};

module.exports = { sendEmail };
