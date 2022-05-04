(async () => {
    const PORT = process.env.PORT || 8082
    const app = await require("../app");

    //logger
    const logger = require("../utils/logger")

    app.listen(PORT, () => logger.log(`Escuchando en puerto ${PORT}`));
})()