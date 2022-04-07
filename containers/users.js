const {Schema, model} = require("mongoose")
const bcrypt = require("bcrypt")

class UserModel {

    constructor() {

        const schema = new Schema({
            email: String,
            name: String,
            surname: String,
            password: String
        })

        this.model = model("users", schema)

    }

    //save user
    async save(obj) {
        obj.password = await bcrypt.hash(obj.password, 10);
        return await this.model.create(obj);
    }

    //exists by email
    existsByEmail(email) {
        return this.model.exists({ email });
    }

    // find by email
    async getByEmail(email) {
        const user = await this.model.findOne({ email }).lean();

        return {
            id: user._id,
            name: user.name,
            surname: user.surname,
            completeName: `${user.name} ${user.surname}`,
            email: user.email
        }

    }

    // find by id
    async getById(id) {
        return await this.model.findById(id).lean();
    }

    //check if passwords match
    async isPasswordValid(email, pwd) {
        const user = await this.model.findOne({ email }).lean()
        return await bcrypt.compare(pwd, user.password);
    }

    findOrCreateByEmail(email, user, done) {
        this.model.findOneAndUpdate({ email }, user, { upsert: true, new: true }, (err, createdUser) => {
            done(err, {
                id: createdUser._id.toString(),
                name: createdUser.name,
                surname: createdUser.surname,
                email: createdUser.email
            })
        })
    }

}

module.exports = new UserModel()