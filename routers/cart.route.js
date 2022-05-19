const { Router } = require("express");

const auth = require("../middlewares/auth")
const controller = require("../controllers/cart.controller")

const router = new Router()

router.get("/products", auth, controller.getProducts)
router.get("/add/:id", auth, controller.add)
router.get("/delete/:id", auth, controller.delete)
router.get("/confirm", auth, controller.confirm)

module.exports = router