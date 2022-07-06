const { Router } = require("express");
const router = new Router()

const controller = require("../controllers/api.products.controller")

router.get("/", controller.getAll)
router.put("/", controller.update)
router.post("/delete", controller.delete)
router.get("/:id", controller.prod)
router.get("/category/:category", controller.category)

module.exports = router