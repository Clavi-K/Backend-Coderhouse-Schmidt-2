const { Router } = require("express");

const controller = require("../controllers/random.controller")
const auth = require("../middlewares/auth")


const router = new Router()

router.get("/randoms", auth, controller.random)

module.exports = router