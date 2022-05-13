const MongoModel = require("../containers/messages");

const logger = require("../utils/logger")

const users = {};

module.exports = async (socket) => {

    logger.info(`New user connected: ${socket.id}`);

    /* --- Disconnection --- */

    socket.on("disconnect", () => {

        logger.info("Disconnected user");

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

    socket.on("message", (msg) => {

        try {

            objValidator(msg);

        } catch (e) {

            logger.error(e);
            throw e;

        }

        MongoModel.saveMessage(msg);
        socket.broadcast.emit("message", msg);

    });

}

function objValidator(obj) {

    for (const atribute in obj) {

        if (!atribute || atribute.trim().length === 0) {
            throw new Error("Invalid object");
        }

    }

}