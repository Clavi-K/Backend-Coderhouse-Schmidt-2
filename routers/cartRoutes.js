const { Router } = require("express");

const auth = require("../middlewares/auth")
const cartModel = require("../containers/carts")
const productModel = require("../containers/products")
const orderModel = require("../containers/orders")
const logger = require("../utils/logger")
const mailSender = require("../notifications/mail")
const WhatsappSender = require("../notifications/whatsapp")

const router = new Router()

router.get("/products", auth, async (req, res) => {

    logger.info(`GET ${req.protocol + '://' + req.get('host') + req.originalUrl} Successful`)

    const userId = req.user._id.toString()

    const cart = await cartModel.getByUser(userId)
    const cartProds = await productModel.getCart(cart.products)

    res.render("cart", { products: cartProds })

})

router.get("/add/:id", auth, async (req, res) => {

    const { id } = req.params

    if (!id) {
        return res.sendStatus(404)
    }

    logger.info(`GET ${req.protocol + '://' + req.get('host') + req.originalUrl} Successful`)

    const userId = req.user._id.toString()

    const cart = await cartModel.getByUser(userId)
    await cartModel.addProduct(cart.id, id)

    res.redirect("/")

})

router.get("/delete/:id", auth, async (req, res) => {

    const { id } = req.params

    if (!id) {
        return res.sendStatus(404)
    }

    logger.info(`GET ${req.protocol + '://' + req.get('host') + req.originalUrl} Successful`)

    const userId = req.user._id.toString()

    const cart = await cartModel.getByUser(userId)
    await cartModel.removeProduct(cart.id, id)

    res.redirect("/cart/products")

})

router.get("/confirm", auth, async (req, res) => {

    logger.info(`GET ${req.protocol + '://' + req.get('host') + req.originalUrl} Successful`)

    const userId = req.user._id.toString()

    const cart = await cartModel.getByUser(userId)
    const orderProds = await productModel.getOrder(cart.products)

    const products = []
    orderProds.map((p) => products.push(p.name))

    const order = await orderModel.save({
        total: orderProds.reduce((tot, p) => tot + p.price, 0),
        sent: false,
        products
    })

    await cartModel.emptyCartByUser(userId)

    const htmlProds = products.map(p => `<li>${p}</li>`)
    const template = `
    <h1> Nuevo pedido de ${req.user.email}</h1>

    <p>Dirección de envío: ${req.user.address}</p>

    <p style="font-weight: bolder;">Productos a enviar:</p>

    <ul>
        ${htmlProds.join(" ")}
    </ul>
    `

    const wspAdminBody = `Nuevo pedido de ${req.user.email}\n
                     Dirección de envío: ${req.user.address}\n
                     Productos a enviar:
                     ${products.join(" ")}`

    const wspClientBody = `Tu pedido de \n
                           ${products.join(" ")}
                           Fue recibido y se encuentra en proceso.\n
                           Te llegará más información de este número con el estado de tu pedido.`

    await mailSender.send(process.env.GMAIL_ADDRESS, "Nuevo pedido", template)
    await WhatsappSender.sendWhatsapp(process.env.ADMIN_PHONE, wspAdminBody)
    await WhatsappSender.sendWhatsapp(req.user.phone, wspClientBody)



    res.redirect("/")

})

module.exports = router