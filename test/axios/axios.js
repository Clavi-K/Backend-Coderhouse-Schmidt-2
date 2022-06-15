
const axios = require("axios")
const logger = require("../../utils/logger")

async function main() {

    try {

        // const dataGet = await axios.get("http://localhost:8082/api/products")
        // logger.info(dataGet.data)

        // const dataPost = await axios.post("http://localhost:8082/api/products", { name: "a", price: 14, platforms: ["PC", "XBOX", "PS5"], image: "a" })
        // logger.info(dataPost.data)

        // const dataUpdate = await axios.put("http://localhost:8082/api/products", { id: "629f46d036bf410095740f73", name: "e", price: 28, platforms: ["PC", "XBOX", "PS5"], image: "a" })
        // logger.info(dataUpdate.data)

        // //aca no pude usar axios.delte, por lo que voy a usar axios.post
        // const dataDelete = await axios.post("http://localhost:8082/api/products/delete", {id: "629f46d036bf410095740f73"})
        // logger.info(dataDelete.data)


        /* -------------------------- GRAPHQL -------------------------- */

        const { data } = await axios.post("http://localhost:8082/graphql", {
            query: `
                    query {
                        getAllProducts {
                            id,
                            name,
                            price,
                            platforms
                        }
                    }`
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })

        logger.info(data.data.getAllProducts)

    } catch (e) {
        logger.error(e)
    }

}

main()
