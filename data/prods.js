const faker = require("faker");

const prods = []

for (let i = 0; i <= 5; i++) {

    prods.push({
        name: faker.commerce.productName(),
        price: faker.commerce.price(),
        thumbnail: faker.image.image()
    });

}

module.exports = prods;