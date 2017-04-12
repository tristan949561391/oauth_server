/**
 * Created by Tristan on 17/3/27.
 */
const userModel = require('../model/user');
const util = require('util');
const commonUtil = require('../utils/index');
const clientModel = require('../model/client');
const BusinessError = require('../error').BusinessError;
const authCode_repository = require('../model/repository/authcode_repository');
const token_repository = require('../model/repository/token_repository');
/**
 * 构建授权码服务
 * @param client_id
 * @param redirect_uri
 * @param scope
 * @param username
 * @param password
 * @returns {Promise.<*|Promise>}
 */
async function build_authenticate_code(client_id, redirect_uri, scope, username, password) {
    //验证客户端的合法性
    let client = await clientModel.findByClientId(client_id);
    if (client === null) {
        throw new BusinessError(1001, '没有找到该客户端');
    }
    if (client.redirect_uri !== redirect_uri) {
        throw new BusinessError(1002, '重定向地址不正确')
    }
    if (!await commonUtil.ArrayInclude('authenticate_code', client.auth_type)) {
        throw new BusinessError(1008, '不支持authenticate_code验证方式');
    }
    let scopeInclude = await commonUtil.include(client.scope, scope, ',');
    if (!scopeInclude) {
        throw new BusinessError(1003, 'scope权限无法匹配');
    }
    //验证用户
    let user = await userModel.findByUsername(username);
    if (user === null) {
        throw new BusinessError(1004, '没有该用户')
    }
    if (user.password !== password) {
        throw new BusinessError(1005, '密码错误')
    }
    //获取授权码
    let code = await authCode_repository.build_authenticate_code(user, client, scope);
    return code;
}

/**
 *
 * @param client_id
 * @param redirect_uri
 * @param client_secret
 * @param code
 * @returns {Promise.<{expire: number, access_token: *, fresh_token: *}>}
 */
async function build_token_by_code(client_id, redirect_uri, client_secret, code) {
    let authdata = await authCode_repository.finder_authenticate_code(client_id, code);
    if (authdata === null) {
        throw new BusinessError(1086, '无效的code');
    }
    if (authdata.client.client_id !== client_id
        || authdata.client.redirect_uri !== redirect_uri
        || authdata.client.client_secret !== client_secret) {
        //和上一步验证不匹配
        throw new BusinessError(1087, '客户端验证失败')
    }
    //客户端验证成功，开始执行获取token任务
    let token = await token_repository.build_token_bycode(authdata.user._id, authdata.client.client_id, authdata.scope, 3600);
    if (token === null) {
        throw new BusinessError(1088, '令牌创建失败')
    }
    return token;
}

async function fresh_token(client_id, client_secret, fresh_token) {
    let client = await clientModel.findByClientId(client_id);
    if (client === null) {
        throw new BusinessError(1056, '找不到该客户端');
    }
    if (client.client_secret !== client_secret) {
        throw new BusinessError(1056, 'client_secret错误');
    }
    if (!await commonUtil.ArrayInclude('fresh_token', client.auth_type)) {
        throw new BusinessError(1008, '不支持该授权方式')
    }
    let token = await token_repository.build_token_byfresh(fresh_token, 3600);
    if (token === null) {
        throw new BusinessError(1057, "fresh_token无效，无法换取")
    }
    return token;
}


async function build_token_by_password(client_id, client_secret, scope, username, password) {
    //----验证用户
    let user = await userModel.findByUsername(username);
    if (user === null) throw new BusinessError(1004, '没有该用户');
    if (user.password !== password) throw new BusinessError(1005, '密码错误');

    // ----验证客户端
    let client = await clientModel.findByClientId(client_id);
    if (client === null) throw new BusinessError(1056, '找不到该客户端');
    if (client.client_secret !== client_secret)throw new BusinessError(1056, 'client_secret错误');
    if (!await commonUtil.ArrayInclude('password', client.auth_type)) {
        throw new BusinessError(1008, '不支持该授权方式')
    }
    let scopeContainer = await commonUtil.include(client.scope, scope, ',');
    if (!scopeContainer)throw new BusinessError(1057, "scope权限不匹配");
    let token = await token_repository.build_token_bypassword(user._id, client.client_id, scope, 3600);
    if (token === null) {
        throw new BusinessError(1088, '令牌创建失败')
    }
    return token;
}

/**
 * 验证access_token的路由插件
 * @param scopes 访问该路由所需要的所有权限
 * @returns {function(*, *)}
 */
let authorization = (scopes) => {
    return async (ctx, next) => {
        let access_token = ctx.accept.headers['authorization'] ||
            ctx.query.authorization ||
            ctx.request.body.authorization;
        if (util.isNullOrUndefined(access_token)) {
            throw new BusinessError(500, 'access token is none');
        }
        let i = await token_repository.find_by_access_token(access_token);
        if (util.isNullOrUndefined(i) || util.isNullOrUndefined(i.user_id)) {
            throw new BusinessError(500, 'access_token is timeout or useless');
        }
        if (i.scope !== 'all') {
            let allInclude = await commonUtil.include(scopes, i.scope, ',');
            if (!allInclude) {
                throw new BusinessError(500, `${i.scope} can not match ${scopes}`);
            }
        }
        ctx.principle = i;
        ctx.user_id = i.user_id;
        next()
    }
};


module.exports = {
    build_authenticate_code: build_authenticate_code,
    build_token_by_code: build_token_by_code,
    build_token_by_password: build_token_by_password,
    fresh_token: fresh_token,
    authorization: authorization
};

