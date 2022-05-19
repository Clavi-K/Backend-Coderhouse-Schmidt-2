const service = require("../services/random.service")
const logger = require("../utils/logger")

module.exports = {

    random: (req, res) => {
        logger.info(`GET ${req.protocol + '://' + req.get('host') + req.originalUrl} Successful`)

        const { amnt } = req.query
        const result = service.random(amnt)

        res.send(JSON.stringify(result, null, 2))
    }

}