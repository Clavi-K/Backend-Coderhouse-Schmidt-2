const twilio = require("twilio")

class WhatsappSender {

    constructor() {
        this.client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH)
    }

    async sendWhatsapp(phone, body) {

        const response = await this.client.messages.create({
            body,
            from: "whatsapp:+14155238886",
            to: `whatsapp:${phone}`
        })

    }

}

module.exports = new WhatsappSender()