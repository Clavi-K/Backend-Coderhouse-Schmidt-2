const { Schema, model } = require("mongoose");
const { schema, normalize, denormalize } = require("normalizr");

class MongoModel {

    constructor() {
        const mensajesSchema = new Schema({
            author: {
                email: String,
                name: String,
                surname: String,
                age: Number,
                phone: String,
                avatar: String
            },
            text: String
        });

        this.model = model("messages", mensajesSchema);
    }

    async saveMessage(message) {
        await this.model.create(message);
    }

    async readMessages() {

        const MongoData = await this.model.find({});

        const author = new schema.Entity("authors", {}, { idAttribute: "email" });
        const message = new schema.Entity("messages", {
            author: author
        });

        const messages = new schema.Entity("data", {
            messages: [message]
        });
        
        const normalizedData = normalize({
            id: "messages",
            messages: MongoData
        }, messages);

        return normalizedData;

    }

}

module.exports = new MongoModel();