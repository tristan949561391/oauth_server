/**
 * Created by tc949 on 2017/3/31.
 */
const redis = require('../conn/redis')
const codeUtils = require('../../utils').codeUtil
const authcode_repository = {
    build_authenticate_code: async (user, client, scope, state) => {
        let code = codeUtils.authcode_builder();
        let data = {
            scope: scope,
            user_id: user.id,
            state: state,
            client_id: client.client_id,
            client_name: client.client_name,
            client_secret: client.client_secret,
            redirect_uri: client.redirect_uri,
            date: new Date()
        }
        let code_key = 'auth_code:' + client.client_id + '-' + code
        redis.set(code_key, JSON.stringify(data), () => {
            redis.expire(code_key, 60);
        });
        return code;
    },
    finder_authenticate_code: (client_id, code) => {
        return new Promise(resove => {
            let code_key = 'auth_code:' + client_id + '-' + code
            redis.get(code_key, (err, data) => {
                if (err) resove(null);
                resove(JSON.parse(data));
            })
        })
    }
}
module.exports = authcode_repository