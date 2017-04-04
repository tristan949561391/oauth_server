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
        fresh_token: codeUtils.fresh_token_builder(),
    };
    let token_data = {
        user_id: user_id,
        client_id: client_id,
        scope: scope,
        date: new Date()
    };
    let fresh_data = {
        user_id: user_id,
        client_id: client_id,
        access_token: token.access_token,
        scope: scope,
        date: new Date()
    };
    let isOk = await  new Promise((resolve) => {
        redis.set('access_token:' + token.access_token, JSON.stringify(token_data), (err, data) => {
            redis.expire('access_token:' + token.access_token, token.expire);
            resolve(data);
        })
    });
    if (util.isNullOrUndefined(isOk)) {
        return null;
    }

    isOk = await new Promise((resolve) => {
        redis.set('fresh_token:' + token.fresh_token, JSON.stringify(fresh_data), (err, data) => {
            redis.expire('fresh_token:' + token.fresh_token, 3600 * 24 * 7);
            resolve(data);
        })
    });

    if (util.isNullOrUndefined(isOk)) {
        redis.del('access_token:' + token.access_token);
        redis.del('fresh_token:' + token.fresh_token);
        return null
    }

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
            resolve(JSON.parse(data));
        })
    });
    if (util.isNullOrUndefined(fresh_data)) {
        return null;
    }
    let token = await this.build_token_bycode(fresh_data.user_id, fresh_data.client_id, fresh_data.scope, time);
    redis.del('access_token:' + fresh_data.access_token);
    redis.del('fresh_token:' + fresh_token);
    return token;
}


async function find_by_access_token(access_token) {
    let token = await  new Promise((resolve) => {
        redis.get('access_token:' + access_token, (err, token) => {
            if (err || util.isNullOrUndefined(token)) {
                resolve(null)
            }
            resolve(JSON.parse(token));
        })
    });
    console.log('token');
    return token;
}

module.exports = {
    build_token_bycode: build_token_bycode,
    build_token_byfresh: build_token_byfresh,
    find_by_access_token: find_by_access_token
};