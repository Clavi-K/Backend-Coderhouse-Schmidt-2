const nodemailer = require("nodemailer")

const email = process.env.GMAIL_ADDRESS
const password = process.env.GMAIL_PWD

class MailSender {

    constructor() {

        this.transporter = nodemailer.createTransport({
            service: "gmail",
            port: 587,
            auth: {
                user: email,
                pass: password
            }
        })

    }

    async send(email, subject, template) {

        const mailOptions = {
            from: "Notificaciones <no-reply>",
            subject,
            to: email,
            html: template
        }

        const response = await this.transporter.sendMail(mailOptions)

    }

}

module.exports = new MailSender()