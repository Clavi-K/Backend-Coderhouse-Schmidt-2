const cartModel = require("./carts.model")
const messageModel = require("./messages.model")
const orderModel = require("./orders.model")
const productModel = require("./products.model")
const userModel = require("./users.model")

class ModelFactory {

    static getModel(modelName) {

        switch (modelName) {

            case "carts":
                return cartModel
            case "messages":
                return messageModel
            case "orders":
                return orderModel
            case "products":
                return productModel
            case "users":
                return userModel
            default:
                throw new Error("Invalid model name")

        }

    }

}

module.exports = ModelFactory