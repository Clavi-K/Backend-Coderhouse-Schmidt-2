(async () => {
    const PORT = require("../config/minimist")
    const app = await require("../app");

    app.listen(PORT, () => console.log(`Escuchando en puerto ${PORT}`));
})()