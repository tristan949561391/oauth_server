/**
 * Created by tc949 on 2017/3/31.
 */
const redis = require('../conn/redis');
const codeUtils = require('../../utils').codeUtil;
/**
 * 创建零时授权码code
 * @param user
 * @param client
 * @param scope
 * @param state
 * @returns {Promise.<object>}
 */
async function build_authenticate_code(user, client, scope, state) {
    let code = codeUtils.authcode_builder();
    let data = {
        user: user,
        client: client,
        scope: scope,
        state: state
    };
    let code_key = 'auth_code:' + client.client_id + '-' + code;
    redis.set(code_key, JSON.stringify(data), () => {
        redis.expire(code_key, 600);
    });
    return code;
}
/**
 * 查找出对应的零时授权码
 * @param client_id
 * @param code
 * @returns {Promise}
 */
async function finder_authenticate_code(client_id, code) {
    return new Promise(resolve => {
        let code_key = 'auth_code:' + client_id + '-' + code;
        redis.get(code_key, (err, data) => {
            if (err || data === null) resolve(null);
            redis.del(code_key);
            resolve(JSON.parse(data));
        })
    })
}
module.exports = {
    build_authenticate_code: build_authenticate_code,
    finder_authenticate_code: finder_authenticate_code
};