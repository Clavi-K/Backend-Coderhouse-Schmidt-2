const mailSender = require("../notifications/mail")
const WhatsappSender = require("../notifications/whatsapp")

const ModelFactory = require("../models/model.factory")
const logger = require("../utils/logger")

const cartModel = ModelFactory.getModel("carts")
const productModel = ModelFactory.getModel("products")
const orderModel = ModelFactory.getModel("orders")

module.exports = {

    getProducts: async (userId) => {

        const cart = await cartModel.getByUser(userId)

        return await productModel.getCart(cart.products)
    },

    add: async (userId, prodId) => {

        const cart = await cartModel.getByUser(userId)

        await cartModel.addProduct(cart.id, prodId)
    },

    delete: async (userId, prodId) => {

        const cart = await cartModel.getByUser(userId)
        await cartModel.removeProduct(cart.id, prodId)

    },

    confirm: async (user) => {

        user.id = user._id.toString()
        const cart = await cartModel.getByUser(user.id)
        const orderProds = await productModel.getOrder(cart.products)

        if (!orderProds.length) {
            return
        }

        const products = []
        orderProds.map((p) => products.push(p.name))

        await orderModel.save({
            total: orderProds.reduce((tot, p) => tot + p.price, 0),
            sent: false,
            products
        })

        await cartModel.emptyCartByUser(user.id)

        const htmlProds = products.map(p => `<li>${p}</li>`)

        const template = `<h1> New order from ${user.email}</h1>
                          <p>Shipment address: ${user.address}</p>
                          <p style="font-weight: bolder;">Product list:</p>
                          <ul>
                            ${htmlProds.join(" ")}
                          </ul>`

        const userTemplate = `<h1>Your Legaltech order:</h1>
                              <p style="font-weight: bolder;">Product list:</p>
                              <ul>
                                ${htmlProds.join(" ")}
                              </ul>`

        const wspAdminBody = `New order from ${ user.email}\n
                     Shipment address: ${ user.address } \n
                     Product list:
                     ${ products.join(" ") } `

        const wspClientBody = `Your order from \n
                           ${ products.join(" ") }
                           Was received and is now being processed.\n
                           You will receive a message from this number when there is any update.`


        try {
            await mailSender.send(process.env.GMAIL_ADDRESS, "Nuevo pedido", template)
            await WhatsappSender.sendWhatsapp(process.env.ADMIN_PHONE, wspAdminBody)

            await mailSender.send(user.email, "Tu pedido", userTemplate)
            await WhatsappSender.sendWhatsapp(user.phone, wspClientBody)
        } catch (error) {
            logger.error(error)
        }

    }
}