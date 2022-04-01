const express = require('express');
const path = require('path')
const http = require('http')
const mongoose = require("mongoose");
const { Server } = require('socket.io');
const { engine } = require('express-handlebars');
const session = require("express-session");
const MongoStore = require("connect-mongo");

const config = require("./config");
const chat = require("./chat")
const viewRouter = require("./routers/routes");


const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = process.env.PORT || 8082;

mongoose.connect(`${config.local.schema}://${config.local.hostname}:${config.local.dbport}/${config.local.database}`).then(() => {

    app.use(session({
        secret: "secret",
        resave: true,
        saveUninitialized: true,
        store: new MongoStore({
            mongoUrl: `${config.atlas.SCHEMA}://${config.atlas.USER}:${config.atlas.PASSWORD}@${config.atlas.HOSTNAME}/${config.atlas.DATABASE}?${config.atlas.OPTIONS}`,
            ttl: 60,
            autoRemove: "interval",
            autoRemoveInterval: 1,
            touchAfter: 60
        })
    }));

    app.set("view engine", "handlebars");
    app.engine("handlebars", engine({
        layoutDir: path.join(__dirname, "views"),
        defaultLayout: "index",
        extname: "hbs"
    }));

    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    app.use("/static", express.static(path.join(__dirname, 'public')));
    app.use("/", viewRouter);

    /* ----------------- WEBSOCKETS ----------------- */

    io.on("connection", chat);

    server.listen(PORT, () => console.log(`Escuchando en puerto ${PORT}`));
});

