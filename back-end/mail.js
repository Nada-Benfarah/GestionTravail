const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");
const queries = require("./db/queries");

let transporter = nodemailer.createTransport(
  smtpTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
      user: "nodejstester2021@gmail.com",
      pass: "Hs7wR7XrY5DR",
    },
  })
);

module.exports = {
  sendMail(email, subject, text) {
    const mailOptions = {
      from: "nodejstester2021@gmail.com",
      to: email,
      subject,
      text,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  },
  async getMailInfo(r_from, r_demande) {
    const from = await queries.getUser(r_from);
    const demande = await queries.getDemande(r_demande);
    const employee = await queries.getUser(demande.from);

    return { from, demande, employee };
  },
};
