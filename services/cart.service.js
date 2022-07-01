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

        const template = `<h1> Nuevo pedido de ${user.email}</h1>
                          <p>Dirección de envío: ${user.address}</p>
                          <p style="font-weight: bolder;">Productos a enviar:</p>
                          <ul>
                            ${htmlProds.join(" ")}
                          </ul>`

        const userTemplate = `<h1>Tu pedido de eCommerce de videojuegos</h1>
                              <p style="font-weight: bolder;">Productos a enviar:</p>
                              <ul>
                                ${htmlProds.join(" ")}
                              </ul>`

        const wspAdminBody = `Nuevo pedido de ${ user.email
}\n
                     Dirección de envío: ${ user.address } \n
                     Productos a enviar:
                     ${ products.join(" ") } `

        const wspClientBody = `Tu pedido de \n
                           ${ products.join(" ") }
                           Fue recibido y se encuentra en proceso.\n
                           Te llegará más información de este número con el estado de tu pedido.`


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