const { Router } = require("express");

const random = require("../utils/randoms")
const auth = require("../middlewares/auth")
const logger = require("../utils/logger")

const router = new Router()

router.get("/randoms", auth, (req, res) => {

    logger.info(`GET ${req.protocol + '://' + req.get('host') + req.originalUrl} Successful`)

    const { amnt } = req.query
    const result = random(amnt)

    res.send(JSON.stringify(result, null, 2))
})

module.exports = router