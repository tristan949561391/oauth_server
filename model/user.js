/**
 * Created by Tristan on 17/3/27.
 */
const mongoose = require('mongoose');
const mongoConn = require('./conn/mongoose')
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: String,
    password: String,
    mobile: String,
    profile: {
        name: {first: String, last: String},
        address: {
            homeland: String,
            live: String
        },
        age: Number,
        gender: String
    }
});

userSchema.statics.findByUsername = (username) => {
    return new Promise((resolve) => {
        User.findOne({'username': username}, (err, user) => {
            if (err) {
                resolve(null)
            }
            resolve(user);
        })
    })
}


userSchema.statics.insertUser = async (user) => {
    return new Promise((resove) => {
        let userEntity = new User(user)
        userEntity.save((err, data) => {
            if (err) resove(null);
            resove(data)
        })
    })
}

const User = mongoConn.model('user_table', userSchema);
module.exports = User