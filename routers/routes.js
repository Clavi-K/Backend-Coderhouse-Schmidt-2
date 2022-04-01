const path = require("path");
const { Router } = require("express");

const auth = require("../middlewares/auth");

const router = new Router();

router.get("/", (req, res) => res.render("login"));

router.post("/login", (req, res) => {

    if (!req.body.email.includes("@")) {
        res.redirect("/");
    } else {
        const user = req.body;

        if (user) {
            req.session.user = {
                email: user.email,
                name: user.name,
                surname: user.surname,
                age: user.age,
                alias: user.alias
            }
        }

        res.redirect("/home");
    }

});

router.get("/home", auth, (req, res) => res.render("home", { user: req.session.user }));

router.get("/logout", auth, (req, res) => {

    const username = req.session.user.name;

    req.session.destroy((err) => {
        if (err) {
            return res.redirect("/");
        }
    });

    res.render("bye", {username});

});

module.exports = router;