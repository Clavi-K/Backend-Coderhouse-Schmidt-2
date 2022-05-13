const cluster = require("cluster")
const CPUs = require("os").cpus().length
const app = require("../app")
const PORT = process.env.PORT || 8082

if (cluster.isPrimary) {

    for (let i = 0; i < CPUs; i++) {
        cluster.fork()
    }

    cluster.on("exit", (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died `)
    })

} else {
    
    app.listen(PORT, () => console.log(`Escuchando en puerto ${PORT}`));

}