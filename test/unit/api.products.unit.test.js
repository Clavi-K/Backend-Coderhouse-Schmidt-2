const supertest = require("supertest")
const chai = require("chai")

let id

const URL = "http://localhost:8082"

describe("Product API test", () => {

    const agent = supertest(URL)

    it("Should create a new product", async () => {

        const response = await agent.post("/api/products").send({
            name: "AAAAAAAAAAAAA",
            price: 272,
            platforms: ["PC", "XBOX", "PS5"],
            image: "../static/img/prods/aAAAAAAAAAAAAAAAAA.jpg"
        })

        chai.expect(response.body.name).to.equal("AAAAAAAAAAAAA")

    })

    it("Should retrieve all products", async () => {

        const response = await agent.get("/api/products")
        id = response.body[response.body.length - 1].id
        chai.expect(response.status).to.equal(200)

    })

    it("Should update a product", async () => {

        const response = await agent.put("/api/products").send({
            id,
            name: "e",
            price: 28,
            platforms: ["PC", "XBOX", "PS5"],
            image: "a"
        })

        chai.expect(response.body.modifiedCount).to.equal(1)

    })

    it("Should delete a product", async () => {

        const response = await agent.post("/api/products/delete").send({ id })
        chai.expect(response.status).to.equal(200)

    })

})