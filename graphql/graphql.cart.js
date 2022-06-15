const { graphqlHTTP } = require("express-graphql")

const schema = require("./schema/cart")
const resolver = require("./resolvers/cart")

module.exports = function (app) {
    app.use('/graphql/cart', graphqlHTTP({
        schema,
        rootValue: resolver,
        graphiql: true
    }))
}