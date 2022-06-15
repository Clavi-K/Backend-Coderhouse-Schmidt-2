const ModelFactory = require("../../models/model.factory")
const cartModel = ModelFactory.getModel("carts")
const cartService = require("../../services/cart.service")
const userModel = ModelFactory.getModel("users")

module.exports = {

    getCartByUser: async ({ userId }) => {
        return await cartModel.getByUser(userId)
    },

    addProduct: async ({ userId, productId }) => {
        const cart = await cartModel.getByUser(userId)
        await cartModel.addProduct(cart.id, productId)
    },

    deleteProduct: async ({ userId, productId }) => {
        const cart = await cartModel.getByUser(userId)
        await cartModel.removeProduct(cart.id, productId)
    },

    confirm: async({ userId }) => {
        const user = await userModel.getById(userId)
        await cartService.confirm(user)
    }

}