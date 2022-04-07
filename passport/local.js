const LocalStrategy = require("passport-local").Strategy
const userModel = require("../containers/users")

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
            console.log(err)
            done(err)
        }

    }

    const registerUser = async (req, email, password, done) => {

        const { name, surname } = req.body

        try {

            if (await userModel.existsByEmail(email)) {
                return done(null, false, { message: "User already exists!" })
            }

            const user = await userModel.save({
                email,
                password,
                name,
                surname,
            })

            done(null, {
                ...user,
                id: user._id,
                completeName: `${name} ${surname}`
            })

        } catch (err) {
            console.log(err)
            done(err)
        }

    }

    passport.use("login", new LocalStrategy({ usernameField: "email" }, authenticateUser))
    passport.use("register", new LocalStrategy({ usernameField: "email", passReqToCallback: true }, registerUser))

    passport.serializeUser((user, done) => done(null, user.id));

    passport.deserializeUser(async (id, done) => {
        console.log(id);
        done(null, await userModel.getById(id));
    });

}