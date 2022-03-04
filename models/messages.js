const knex = require("knex");

class Messages {
    constructor() {
        this.db = knex(
            this.proDbConfig = {
                client: "sqlite3",
                connection: {
                    filename: "./messages.sqlite"
                },
                useNullAsDefault: true
            });
    }

    async loadData() {

        try {

            await this.db.schema.createTableIfNotExists("messages", (table) => {
                table.increments("id");
                table.string("msg");
                table.string("date");
                table.string("user");
            });

        } catch (e) {

            console.log(`Hubo un error: ${e}`);
            throw e;

        }

    }

    async newMsg(msg) {
        await this.db("products").insert(msg);
    }

}

module.exports = new Messages();