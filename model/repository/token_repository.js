/**
 * Created by tc949 on 2017/3/31.
 */
const redis = require('../conn/redis');
const codeUtils = require('../../utils').codeUtil;
const util = require('util');
/**
 * 传入用户，客户端，以及超时时间来获取token令牌
 * @param user_id 用户ID
 * @param client_id 客户端ID
 * @param scope 请求的权限
 * @param time access_token 过期时间
 * @returns {Promise.<{expire: number, access_token: *, fresh_token: *}>}
 */
async function build_token_bycode(user_id, client_id, scope, time) {
    let token = {
        expire: time | 3600,
        access_token: codeUtils.access_token_builder(),
        fresh_token: codeUtils.fresh_token_builder()
    };

    let token_data = {
        user_id: user_id,
        client_id: client_id,
        scope: scope,
        date: Date.now(),
        expire_date: Date.now() + time * 1000
    };
    let fresh_data = {
        user_id: user_id,
        client_id: client_id,
        access_token: token.access_token,
        scope: scope,
        date: Date.now() + 60000 * 60 * 24 * 7
    };

    let tokenBlow = {
        access_token: token.access_token,
        fresh_token: token.fresh_token,
        create_time: Date.now()

    };
    await new Promise(resolve => {
        redis.get(`tokens:${user_id}:client:${client_id}`, (err, data) => {
            let multi = redis.multi();
            if (!util.isNullOrUndefined(data)) {
                let d = JSON.parse(data);
                multi
                    .del('access_token:' + d.access_token)
                    .del('fresh_token:' + d.fresh_token)
            }
            multi
                .set('access_token:' + token.access_token, JSON.stringify(token_data))
                .set('fresh_token:' + token.fresh_token, JSON.stringify(fresh_data))
                .set(`tokens:${user_id}:client:${client_id}`, JSON.stringify(tokenBlow))
                .exec(() => {
                    resolve()
                })
        });
    });
    return token;
}

/**
 * 使用刷新令牌换取token
 * @param fresh_token 刷新令牌
 * @param time token有效时长
 * @returns {Promise.<{expire: number, access_token: *, fresh_token: *}>} token实体
 */
async function build_token_byfresh(fresh_token, time) {
    let fresh_data = await new Promise((resolve) => {
        redis.get('fresh_token:' + fresh_token, (err, data) => {
            if (err || util.isNullOrUndefined(data)) {
                resolve(null)
            }
            redis
                .multi()
                .del('access_token:' + fresh_data.access_token)
                .del('fresh_token:' + fresh_token)
                .exec();
            let token = JSON.parse(data);
            if (token.expire_date < Date.now()) {
                resolve(null);
            }
            resolve(token)
        })
    });
    if (util.isNullOrUndefined(fresh_data)) {
        return null;
    }
    return await this.build_token_bycode(fresh_data.user_id, fresh_data.client_id, fresh_data.scope, time);
}


async function find_by_access_token(access_token) {
    return await new Promise((resolve) => {
        redis.get('access_token:' + access_token, (err, data) => {
            if (err || util.isNullOrUndefined(data)) {
                resolve(null)
            }
            let token = JSON.parse(data);
            if (token.expire_date < Date.now()) {
                redis.del('access_token:' + access_token);
                resolve(null)
            }
            resolve(token);
        })
    });
}


async function build_token_bypassword(user_id, client_id, scope, time) {
    return await this.build_token_bycode(user_id, client_id, scope, time);
}

module.exports = {
    build_token_bycode: build_token_bycode,
    build_token_byfresh: build_token_byfresh,
    find_by_access_token: find_by_access_token,
    build_token_bypassword: build_token_bypassword
};