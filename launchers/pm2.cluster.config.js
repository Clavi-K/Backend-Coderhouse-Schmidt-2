module.exports = {
    apps: [{
        name: "Server Cluster",
        script: "./launchers/server.js",
        args: "8082",
        instances: "max",
        exec_mode: "cluster"
    }]
}