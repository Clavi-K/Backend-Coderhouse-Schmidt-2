const { Router } = require("express");
const router = new Router()

const controller = require("../controllers/api.products.controller")

router.get("/", controller.getAll)
router.post("/", controller.save)
router.put("/", controller.update)
router.post("/delete", controller.delete)

module.exports = router