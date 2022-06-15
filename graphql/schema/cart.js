const { buildSchema } = require("graphql")

const schema = `
    type Cart {
        id: String!
        userId: String!
        products: [String]
    }

    type Query {
        getCartByUser(userId: String): Cart
    }

    type Mutation {
        addProduct(userId: String, productId: String): String
        deleteProduct(userId: String, productId: String): String
        confirm(userId: String): String
    }

    `

module.exports = buildSchema(schema)