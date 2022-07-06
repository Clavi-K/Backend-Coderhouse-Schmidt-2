const minimist = require("minimist")

const ModelFactory = require("../models/model.factory")
const productModel = ModelFactory.getModel("products")

module.exports = {

    getHome: async () => {
        return await productModel.getAll()
    },

    info: () => {
        const CPUs = require("os").cpus().length

        return {
            arguments: minimist(process.argv.slice(2)),
            platform: process.platform,
            version: process.version,
            memoryUsage: process.memoryUsage.rss(),
            execPath: process.execPath,
            processId: process.pid,
            mainPath: process.mainModule.path,
            CPUs: CPUs
        }
    },

    newProd: async (req) => {

        const obj = req.body
        const file = req.file
        const objDb = {}

        if (!obj.name) {
            return "Missing product name!"
        }

        if (!obj.price) {
            return "Missing product price!"
        }

        if (obj.price <= 0) {
            return "Invalid product price!"
        }

        if (!obj.platforms) {
            return "Missing product platforms!"
        }

        if (!obj.category) {
            return "Missing product category"
        }

        if (!file) {
            return "Missing product image!"
        }

        if (typeof obj.platforms == "object") {

            objDb.name = obj.name
            objDb.price = obj.price
            objDb.platforms = obj.platforms
            objDb.image = `../static/img/prods/${obj.name}.jpg`
            objDb.category = obj.category


        } else if (typeof obj.platforms == "string") {

            objDb.name = obj.name
            objDb.price = obj.price
            objDb.platforms = [obj.platforms]
            objDb.image = `../static/img/prods/${obj.name}.jpg`
            objDb.category = obj.category

        }

        await productModel.save(objDb)

    }


}

