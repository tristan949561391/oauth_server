/**
 * Created by Tristan on 17/3/27.
 */
const mongoose = require('mongoose');
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

const User = mongoose.model('user_table', userSchema);