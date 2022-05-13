const { Schema, model, Types } = require("mongoose")

class CartModel {

    constructor() {

        const schema = new Schema({
            userId: String,
            products: { type: [String], default: [] }
        })

        this.model = model("carts", schema)

    }

    //create cart
    async save(obj) {

        const cart = await this.model.create(obj)

        return {
            id: cart._id.toString(),
            userId: cart.userId,
            products: cart.products
        }

    }

    //delete cart
    async delete(id) {
        return await this.model.deleteOne({ _id: Types.ObjectId(id) })
    }

    //get by id
    async getById(id) {

        const cart = await this.model.findById(Types.ObjectId(id)).lean()

        return {
            id: cart._id.toString(),
            userId: cart.userId,
            products: cart.products
        }

    }

    //get by userId
    async getByUser(id) {

        const cart = await this.model.findOne({ userId: id }).lean()

        if (!cart) {
            return {}
        }

        return {
            id: cart._id.toString(),
            userId: cart.userId,
            products: cart.products
        }

    }

    //add product
    async addProduct(id, productId) {

        const cart = await this.model.findById(Types.ObjectId(id))

        if (cart.products.includes(productId)) {
            return
        }

        cart.products.push(productId)

        await cart.save()

    }

    //remove product
    async removeProduct(id, productId) {

        const cart = await this.model.findById(Types.ObjectId(id))

        if (!cart.products.includes(productId)) {
            return
        }

        cart.products = cart.products.filter(pId => pId != productId)

        await cart.save()

    }

    //empty cart by user
    async emptyCartByUser(id) {

        const cart = await this.model.findOne({ userId: id })

        cart.products = []

        await cart.save()

    }

    //prod amount by user
    async prodAmountByUser(userId) {

        const cart = await this.getByUser(userId)
        return cart.products.length
        
    }

}

module.exports = new CartModel()