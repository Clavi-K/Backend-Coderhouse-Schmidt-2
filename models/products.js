const knex = require("knex");
const prods = require("../data/prods");

class Products {

    constructor() {
        this.db = knex({
            client: "mysql",
            connection: {
                hsot: "localhost",
                port: 3306,
                user: "root",
                password: "root",
                database: "coderhouse"
            }
        })
    }

    async loadData() {
        
        try {

            await this.db.schema.dropTableIfExists("products");

            await this.db.schema.createTable("products", (table) => {
                table.increments("id");
                table.string("name");
                table.integer("price");
                table.string("thumbnail");
            });

            for (const prod of prods) {

                await this.db("products").insert(prod);

            }

        } catch (e) {

            console.log(`Hubo un error: ${e}`);
            throw e;

        }

    }

    async getAll() {
        const products = await this.db.select().from("products");
        return products;
    }

    async newProd(prod) {
        await this.db("products").insert(prod);
    }

}

module.exports = new Products();