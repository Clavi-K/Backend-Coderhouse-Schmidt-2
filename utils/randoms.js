module.exports = (num) => {

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
        result.numbers.push(Math.floor(Math.random() * (1000 - 1 + 1)) + 1)
    }

    for (let i = 0; i < iterator; i++) {

        result[result.numbers[i].toString()] = 0
        result.numbers.forEach((n) => (n === result.numbers[i] && result[result.numbers[i].toString()]++))

    }

    return result
}