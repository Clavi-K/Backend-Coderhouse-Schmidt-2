(async () => {
    const PORT = require("../config/minimist")
    const app = await require("../app");

    //logger
    const logger = require("../utils/logger")

    app.listen(PORT, () => logger.log(`Escuchando en puerto ${PORT}`));
})()