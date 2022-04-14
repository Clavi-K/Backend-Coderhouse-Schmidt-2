const { Router } = require("express");
const passport = require("passport")
const minimist = require("minimist")
const {fork} = require("child_process")

const auth = require("../middlewares/auth");

const router = new Router();

router.get("/", auth, (req, res) => {
    res.render("home", { user: req.user })
});

router.post("/register", passport.authenticate("register", {
    successRedirect: "/",
    failureRedirect: "/register",
    failureFlash: true
}))

router.post("/login", passport.authenticate("login", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
}))

router.get("/register", (req, res) => res.render("register"))
router.get("/login", (req, res) => res.render("login"))

router.get("/logout", auth, (req, res) => {

    const { name, surname } = req.user
    const username = `${name} ${surname}`

    req.logOut()
    res.render("bye", { username })

});

router.get("/info", auth, (req, res) => {

    res.send({
        arguments: minimist(process.argv.slice(2)),
        platform: process.platform,
        version: process.version,
        memoryUsage: process.memoryUsage.rss(),
        execPath: process.execPath,
        processId: process.pid,
        mainPath: process.mainModule.path
    })

})


module.exports = router;