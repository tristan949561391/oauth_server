/**
 * Created by tc949 on 2017/3/31.
 */
const redis = require('../conn/redis')
const codeUtils = require('../../utils').codeUtil
const token_repository = {
    build_token: async (user, client, time) => {
        let token = {
            expire: time | 3600,
            access_token: codeUtils.access_token_builder(),
            fresh_token: codeUtils.fresh_token_builder(),
        }
        return token;
    }
}
module.exports = token_repository