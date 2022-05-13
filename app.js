require('dotenv').config({ path: '.env' })
const express = require('express')
const path = require('path')
const http = require('http')
const mongoose = require("mongoose")
const { Server } = require('socket.io')
const { engine } = require('express-handlebars')
const session = require("express-session")
const MongoStore = require("connect-mongo")

// passport and flash
const passport = require("passport")
const flash = require("express-flash")
const initializePassportLocal = require("./passport/local")

const config = require("./config")
const chat = require("./chat")

//routers
const viewRouter = require("./routers/routes")
const randomsRouter = require("./routers/randomsRoutes")
const cartRouter = require("./routers/cartRoutes")

//logger
const logger = require("./utils/logger")

const app = express()
const server = http.createServer(app)
const io = new Server(server)

mongoose.connect(`${config.atlas.SCHEMA}://${config.atlas.USER}:${config.atlas.PASSWORD}@${config.atlas.HOSTNAME}/${config.atlas.DATABASE}?${config.atlas.OPTIONS}`).then(() => {

    initializePassportLocal(passport);

    app.set("view engine", "handlebars");
    app.engine("handlebars", engine({
        layoutDir: path.join(__dirname, "views"),
        defaultLayout: "index",
        extname: "hbs"
    }));

    app.use(express.json())
    app.use(flash())
    app.use(express.urlencoded({ extended: true }))

    app.use(session({
        secret: "secret",
        resave: true,
        saveUninitialized: true,
        store: new MongoStore({
            mongoUrl: `${config.atlas.SCHEMA}://${config.atlas.USER}:${config.atlas.PASSWORD}@${config.atlas.HOSTNAME}/${config.atlas.DATABASE}?${config.atlas.OPTIONS}`,
            ttl: 10 * 60,
            expires: 1000 * 10 * 60,
            autoRemove: "native"
        })
    }));

    app.use(passport.initialize())
    app.use(passport.session())

    app.use("/static", express.static(path.join(__dirname, 'public')))
    app.use("/", viewRouter)
    app.use("/cart", cartRouter)
    app.use("/api", randomsRouter)

    app.get("*", (req, res) => {
        logger.warn(`GET ${req.protocol + '://' + req.get('host') + req.originalUrl} Not found`)
        res.send("Not found \n <a href='/'>Home</a>")
    })

    /* ----------------- WEBSOCKETS ----------------- */

    io.on("connection", chat);

});

module.exports = server



