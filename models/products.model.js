const { Schema, model, Types } = require("mongoose")

class ProductModel {

    constructor() {

        const schema = new Schema({
            name: String,
            platforms: { type: [String], default: [] },
            price: Number,
            image: String,
            category: String
        })

        this.model = model("products", schema)

    }

    //get all products
    async getAll() {

        const data = await this.model.find({}).lean()

        return data.map((product) => ({
            id: product._id,
            name: product.name,
            price: product.price,
            platforms: product.platforms,
            image: product.image,
            category: product.category
        }))

    }

    //save product
    async save(obj) {
        const product = await this.model.create(obj)
        return {
            id: product._id,
            name: product.name,
            price: product.price,
            platforms: product.platforms,
            image: product.image,
            category: product.category
        }
    }

    //update
    async update(obj) {

        const original = await this.model.updateOne({ _id: Types.ObjectId(obj.id) }, obj)
        return original

    }

    //delete product
    async delete(id) {
        return await this.model.deleteOne({ _id: Types.ObjectId(id) })
    }

    //get by id
    async getById(id) {

        try {

            const product = await this.model.findById(Types.ObjectId(id)).lean()
            return {
                id: product._id,
                name: product.name,
                price: product.price,
                platforms: product.platforms,
                image: product.image,
                category: product.category
            }

        } catch (error) {

            return ("Object does not exists!")

        }

    }

    //get cart
    async getCart(cartProds) {

        const result = []

        for (let i = 0; i < cartProds.length; i++) {

            const product = await this.model.findById(Types.ObjectId(cartProds[i])).lean()

            result.push({
                id: product._id,
                name: product.name,
                price: product.price,
                platforms: product.platforms,
                image: product.image,
                category: product.category
            })

        }

        return result

    }

    //get order
    async getOrder(cartProds) {

        const result = []

        for (let i = 0; i < cartProds.length; i++) {

            const product = await this.model.findById(Types.ObjectId(cartProds[i])).lean()

            result.push({
                name: product.name,
                price: product.price
            })

        }

        return result

    }

    async getByCategory(cat) {
        const prods = await this.model.find({ category: cat })
        return prods
    }

}

module.exports = new ProductModel()