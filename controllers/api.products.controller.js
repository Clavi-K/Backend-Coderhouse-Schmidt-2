const logger = require("../utils/logger")
const service = require("../services/api.products.service")

module.exports = {

    getAll: async (req, res) => {
        logger.info(`GET ${req.protocol + '://' + req.get('host') + req.originalUrl} Successful`)

        const prods = await service.getAll()
        res.send(prods)
    },

    save: async (req, res) => {
        logger.info(`POST ${req.protocol + '://' + req.get('host') + req.originalUrl} Successful`)

        const response = await service.save(req.body)
        res.send(response).status(201)

    },

    update: async (req, res) => {
        logger.info(`PUT ${req.protocol + '://' + req.get('host') + req.originalUrl} Successful`)

        const response = await service.update(req.body)
        res.send(response).status(200)

    },

    delete: async (req, res) => {
        logger.info(`POST ${req.protocol + '://' + req.get('host') + req.originalUrl} Successful`)

        const { id } = req.body

        const response = await service.delete(id)
        res.send(response).status(200)

    }

}