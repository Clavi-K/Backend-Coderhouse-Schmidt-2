const { Schema, model, Types } = require("mongoose")
const moment = require("moment")

class OrderModel {

    constructor() {

        const schema = new Schema({
            userId: String,
            products: {type: [String], default: []},
            total: { type: Number, default: 0 },
            created: { type: Date, default: Date.now },
            sent: Boolean
        })

        this.model = model("orders", schema)

    }

    //get all orders
    async getAll() {

        const data = await this.model.find({}).lean()

        return data.map((order) => ({
            id: order._id.toString(),
            userId: order.userId,
            total: order.total,
            created: moment(order.created).format('DD-MM-YYYY HH:mm'),
            sent: order.sent ? 'Si' : 'No'
        }))

    }

    //save order
    async save(obj) {

        const order = await this.model.create(obj)

        return {
            id: order._id.toString(),
            userId: order.userId,
            total: order.total,
            products: order.products,
            created: moment(order.created).format('DD-MM-YYYY HH:mm'),
            sent: order.sent ? 'Si' : 'No'
        }

    }

    //delete order
    async delete(id) {
        return await this.model.deleteOne({ _id: Types.ObjectId(id) })
    }

    //get by id
    async getById(id) {

        const order = await this.model.findById(Types.ObjectId(id)).lean()

        return {
            id: order._id.toString(),
            userId: order.userId,
            total: order.total,
            created: moment(order.created).format('DD-MM-YYYY HH:mm'),
            sent: order.sent ? 'Si' : 'No'
        }

    }

    //get by user
    async getByUser(userId) {

        const data = await this.model.find({ userId }).lean()

        return data.map((order) => ({
            id: order._id.toString(),
            userId: order.userId,
            total: order.total,
            created: moment(order.created).format('DD-MM-YYYY HH:mm'),
            sent: order.sent ? 'Si' : 'No'
        }))

    }

    //update sent
    async updateSent(id, sent) {

        const order = await this.model.findById(Types.ObjectId(id)).lean()

        order.sent = sent

        await order.save()

    }

}

module.exports = new OrderModel()