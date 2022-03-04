const express = require('express');
const path = require('path')
const http = require('http')
const { Server } = require('socket.io');
const PORT = process.env.PORT || 8082;
const Products = require("./models/products");
const Messages = require("./models/messages");
let prods = [];

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use("/static", express.static(path.join(__dirname, 'public')));
app.get("/", (req, res) => res.sendFile(path.join(__dirname, 'public/index.html')));

const users = {};

(async () => {
    try {

        await Products.loadData();
        console.log("Created database");
        prods = await Products.getAll();

    } catch (e) {

        console.log(`Hubo un error: ${e}`);
        throw e;

    }
})();

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


    socket.on("userEmail", (email) => {
        users[socket.id] = email;

        for (const u of Object.entries(users)) {

            socket.emit("users", { id: u[0], email: u[1] });

        }

        socket.broadcast.emit("users", { id: socket.id, email });

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

        Messages.newMsg(msg);
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