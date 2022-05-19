const service = require("../services/cart.service")
const logger = require("../utils/logger")

module.exports = {

    getProducts: async (req, res) => {
        logger.info(`GET ${req.protocol + '://' + req.get('host') + req.originalUrl} Successful`)

        const userId = req.user._id.toString()
        const products = await service.getProducts(userId)

        res.render("cart", { products })
    },

    add: async (req, res) => {

        const { id } = req.params

        if (!id) {
            return res.sendStatus(404)
        }

        logger.info(`GET ${req.protocol + '://' + req.get('host') + req.originalUrl} Successful`)

        const userId = req.user._id.toString()

        await service.add(userId, id)

        res.redirect("/")
    },

    delete: async (req, res) => {

        const { id } = req.params

        if (!id) {
            return res.sendStatus(404)
        }

        logger.info(`GET ${req.protocol + '://' + req.get('host') + req.originalUrl} Successful`)

        const userId = req.user._id.toString()

        await service.delete(userId, id)

        res.redirect("/cart/products")

    },

    confirm: async (req, res) => {

        logger.info(`GET ${req.protocol + '://' + req.get('host') + req.originalUrl} Successful`)

        const user = req.user
        await service.confirm(user)
    
        res.redirect("/")
    }

}