module.exports = {
    local: {
        hostname: "localhost",
        schema: "mongodb",
        database: "ecommerce",
        dbport: "27017"
    },
    atlas: {
        HOSTNAME: process.env.ATLASHOSTNAME,
        SCHEMA: process.env.ATLASSCHEMA,
        USER: process.env.ATLASUSER,
        PASSWORD: process.env.MONGOPASSWORD,
        DATABASE: process.env.ATLASDATABASE,
        OPTIONS: process.env.ATLASOPTIONS
    }
}
