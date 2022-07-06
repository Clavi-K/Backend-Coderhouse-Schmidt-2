const ModelFactory = require("../models/model.factory")
const logger = require("../utils/logger")
const productModel = ModelFactory.getModel("products")

module.exports = {

    getAll: async () => {
        const prods = await productModel.getAll()
        return prods
    },

    save: async (obj) => {

        if (!obj.name) {
            throw new Error("Wrong object format")
        }

        if (!obj.price) {
            throw new Error("Wrong object format")
        }

        if (!obj.platforms) {
            throw new Error("Wrong object format")
        }

        if (!obj.image) {
            throw new Error("Wrong object format")
        }

        return await productModel.save(obj)

    },

    update: async (obj) => {
        return await productModel.update(obj)
    },

    delete: async (id) => {
        return await productModel.delete(id)
    },

    prod: async (id) => {
        const response = await productModel.getById(id)

        if (!response.name) {
            return "Product does not exists! <a href='/'>Home</a>"
        } else {
            return response
        }

    },

    category: async (cat) => {
        const response = await productModel.getByCategory(cat)
        return response
    }

}