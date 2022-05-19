const LocalStrategy = require("passport-local").Strategy

const userModel = require("../models/users.model")
const cartModel = require("../models/carts.model")
const logger = require("../utils/logger")
const mailSender = require("../notifications/mail")

module.exports = (passport) => {

    const authenticateUser = async (email, password, done) => {

        try {

            if (!await userModel.existsByEmail(email)) {
                return done(null, false, { message: "User does not exists!" })
            }

            if (!await userModel.isPasswordValid(email, password)) {
                return done(null, false, { message: "Incorrect password!" })
            }

            const user = await userModel.getByEmail(email)
            done(null, user)

        } catch (err) {
            logger.error(error)
            done(err)
        }

    }

    const registerUser = async (req, email, password, done) => {

        const { name, surname, age, phone, address } = req.body

        try {

            if (await userModel.existsByEmail(email)) {
                return done(null, false, { message: "User already exists!" })
            }

            if (!req.file) {
                return done(null, false, { message: "No avatar selected" })
            }

            if (phone.charAt(0) !== "+") {
                return done(null, false, { message: "Invalid phone format" })
            }

            const user = await userModel.save({
                email,
                password,
                name,
                surname,
                age,
                phone,
                address,
                avatar: `../static/img/${email}.jpg`
            })

            const cart = await cartModel.save({
                userId: user._id,
                products: []
            })

            await mailSender.send(process.env.GMAIL_ADDRESS, "Nuevo usuario registrado", `
                <h1>Nuevo usuario registrado</h1>
                <p>Correo electrónico: ${user.email}</p>
                <p>Nombre: ${user.name}</p>
                <p>Apellido: ${user.surname}</p>
                <p>Edad: ${user.age}</p>
                <p>Dirección: ${user.address}</p>
                <p>Número telefónico: ${user.phone}</p>
            `)

            done(null, {
                ...user,
                id: user._id,
                completeName: `${name} ${surname}`
            })

        } catch (err) {
            logger.error(err)
            done(err)
        }

    }

    passport.use("login", new LocalStrategy({ usernameField: "email" }, authenticateUser))
    passport.use("register", new LocalStrategy({ usernameField: "email", passReqToCallback: true }, registerUser))

    passport.serializeUser((user, done) => done(null, user.id));

    passport.deserializeUser(async (id, done) => {
        logger.info(id);
        done(null, await userModel.getById(id));
    });

}