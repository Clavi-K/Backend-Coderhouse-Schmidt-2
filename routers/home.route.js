const { Router } = require("express")
const passport = require("passport")
const compression = require("compression")

const auth = require("../middlewares/auth")
const upload = require("../middlewares/avatar")
const uploadPord = require("../middlewares/productImg")
const controller = require("../controllers/home.controller")

const router = new Router();

router.get("/", auth, controller.getHome);

router.post("/register", upload.single("avatar"), passport.authenticate("register", {
    successRedirect: "/",
    failureRedirect: "/register",
    failureFlash: true
}))

router.post("/login", passport.authenticate("login", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
}))

router.get("/newProd", auth, controller.getNewProd)

router.post("/newProd", auth, uploadPord.single("image"), controller.postNewProd)

router.get("/register", controller.getRegister)
router.get("/login", controller.getLogin)
router.get("/logout", auth, controller.logout);
router.get("/info", auth, compression(), controller.info)
router.get("/chat", auth, controller.chat)
router.get("/profile", auth, controller.profile)

module.exports = router;