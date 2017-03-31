/**
 * Created by tc949 on 2017/3/31.
 */
const uuid = require('uuid')
let codeUtil = {
    authcode_builder: () => {
        return uuid.v4()
    },
    access_token_builder: () => {
        return uuid.v4()
    },
    fresh_token_builder: () => {
        return uuid.v4()
    },
    client_id_builder: () => {
        return uuid.v4()
    },
    client_secret_builder: () => {
        return uuid.v4()
    }
}
module.exports = codeUtil

