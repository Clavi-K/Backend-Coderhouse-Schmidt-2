const { Router } = require("express");

const random = require("../utils/randoms")
const auth = require("../middlewares/auth")

const router = new Router()

router.get("/randoms", auth, (req, res) => {

    const { amnt } = req.query
    const result = random(amnt)

    res.send(JSON.stringify(result, null, 2))
})

module.exports = router