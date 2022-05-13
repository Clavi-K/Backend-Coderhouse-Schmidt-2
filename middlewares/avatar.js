const multer = require("multer")
const path = require("path")

const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../public/img"));
    },

    filename: (req, file, cb) => {
        const {email} = req.body
        cb(null, `${email}.jpg`)
    }

})

const upload = multer({ storage: storage })

module.exports = upload