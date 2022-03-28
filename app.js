const express = require('express');
const path = require('path')
const http = require('http')
const { Server } = require('socket.io');
const PORT = process.env.PORT || 8082;
const prods = require("./data/prods");
const mongoose = require("mongoose");
const config = require("./config");



const app = express();
const server = http.createServer(app);
const io = new Server(server);
const MongoModel = require("./containers/messages");

mongoose.connect(`${config.schema}://${config.hostname}:${config.dbport}/${config.database}`).then(() => {
    app.use("/static", express.static(path.join(__dirname, 'public')));
    app.get("/", (req, res) => res.sendFile(path.join(__dirname, 'public/index.html')));

    const users = {};

    /* ----------------- WEBSOCKETS ----------------- */

    io.on("connection", async (socket) => {

        console.log(`New user connected: ${socket.id}`);
        socket.emit("prods", prods);

        /* --- Disconnection --- */

        socket.on("disconnect", () => {

            console.log("Disconnected user");

            delete users[socket.id];
            socket.broadcast.emit("offline", socket.id);

        });


        socket.on("userEmail", async (user) => {
            users[socket.id] = user.email;

            for (const u of Object.entries(users)) {

                socket.emit("users", { id: u[0], email: u[1] });

            }

            const messages = await MongoModel.readMessages();

            socket.broadcast.emit("users", { id: socket.id, email: user.email });
            socket.emit("messages", messages);

        });

        socket.on("newProd", (prod) => {

            try {

                objValidator(prod);

            } catch (e) {

                console.log(e);
                throw e;
            }

            prod.price = parseInt(prod.price);
            prods.push(prod);

            io.emit("prods", prods);

        });

        socket.on("message", (msg) => {

            try {

                objValidator(msg);

            } catch (e) {

                console.log(e);
                throw e;

            }

            MongoModel.saveMessage(msg);
            socket.broadcast.emit("message", msg);

        });

    });

    server.listen(PORT, () => console.log(`Escuchando en puerto ${PORT}`));

    function objValidator(obj) {

        for (const atribute in obj) {

            if (!atribute || atribute.trim().length === 0) {
                throw new Error("Invalid object");
            }

        }

    }
});

