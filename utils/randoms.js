const randoms = (num) => {

    let iterator

    if (!Number(num)) {
        iterator = 10e8
    } else {
        iterator = num
    }

    const result = {
        numbers: []
    }

    for (let i = 0; i < iterator; i++) {
        result.numbers.push(Math.floor(Math.random() * (10 - 1 + 1)) + 1)
    }

    for (let i = 0; i < iterator; i++) {

        result[result.numbers[i].toString()] = 0
        result.numbers.forEach((n) => (n === result.numbers[i] && result[result.numbers[i].toString()]++))

    }

    return result
}

process.on("message", msg => {

    if (msg === "start") {

        const sum = randoms(process.argv[2])
        process.send(sum)

        process.exit()

    }

})
