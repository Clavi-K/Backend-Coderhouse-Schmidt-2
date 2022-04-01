module.exports = {
    local: {
        hostname: "localhost",
        schema: "mongodb",
        database: "ecommerce",
        dbport: "27017"
    },
    atlas: {
        HOSTNAME: "cluster0.j3uwp.mongodb.net",
        SCHEMA: "mongodb+srv",
        USER: "localhost",
        PASSWORD: process.env.MONGOPASSWORD,
        DATABASE: "chat",
        OPTIONS: "retryWrites=true&w=majority"
    }
}
