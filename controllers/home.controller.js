const service = require("../services/home.service")
const logger = require("../utils/logger")


module.exports = {

    getHome: async (req, res) => {
        logger.info(`GET ${req.protocol + '://' + req.get('host') + req.originalUrl} Successful`)

        const user = req.user
        const prods = await service.getHome()

        res.render("home", { user, prods })
    },

    getRegister: (req, res) => {
        res.render("register")
    },

    getLogin: (req, res) => {
        res.render("login")
    },


    logout: (req, res) => {
        logger.info(`GET ${req.protocol + '://' + req.get('host') + req.originalUrl} Successful`)

        const { name, surname } = req.user
        const username = `${name} ${surname}`

        req.logOut()
        res.render("bye", { username })
    },

    info: (req, res) => {
        logger.info(`GET ${req.protocol + '://' + req.get('host') + req.originalUrl} Successful`)

        const info = service.info()

        res.render("info", { info })
    },

    chat: (req, res) => {
        logger.info(`GET ${req.protocol + '://' + req.get('host') + req.originalUrl} Successful`)

        const user = req.user

        res.render("chat", { user })
    },

    profile: (req, res) => {
        logger.info(`GET ${req.protocol + '://' + req.get('host') + req.originalUrl} Successful`)

        const user = req.user

        res.render("profile", { user })
    },

    getNewProd: (req, res) => {
        const user = req.user
        res.render("newProd", { user })
    },

    postNewProd: async (req, res) => {
        logger.info(`POST ${req.protocol + '://' + req.get('host') + req.originalUrl} Successful`)

        const error = await service.newProd(req)

        if (error) {
            return res.render("newProd", { user: req.user, messages: { error } })
        }

        return res.redirect("/")

    }

}
