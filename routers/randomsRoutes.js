const { Router } = require("express");
const { fork } = require("child_process")

const auth = require("../middlewares/auth");

const router = new Router()

router.get("/randoms", auth, (req, res) => {

    const { amnt } = req.query

    const randoms = fork("./utils/randoms.js", [amnt])
    randoms.send("start")

    randoms.on("message", (result) => {
        res.send(JSON.stringify(result, null, 2))
    })

})

module.exports = router