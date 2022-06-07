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
    }

}

