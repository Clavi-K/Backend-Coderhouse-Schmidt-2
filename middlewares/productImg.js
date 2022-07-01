const multer = require("multer")
const path = require("path")

const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../public/img/prods"));
    },

    filename: (req, file, cb) => {
        const {name} = req.body
        cb(null, `${name}.jpg`)
    }

})

const upload = multer({ storage: storage })

module.exports = upload