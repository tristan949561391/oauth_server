/**
 * Created by Tristan on 17/3/27.
 */
const clientService = require('./client.service')
const userService = require('./user.service')
const BusinessError = require('../error').BusinessError;
const authCode_repository = require('../model/repository/authcode_repository');
const token_repository = require('../model/repository/token_repository');
let oauthService = {
    /**
     * 构建授权码服务
     * @param client_id
     * @param redirect_uri
     * @param scope
     * @param username
     * @param password
     * @returns {Promise.<*|Promise>}
     */
    build_authenticate_code: async (client_id, redirect_uri, scope, state, username, password) => {
        //验证客户端的合法性
        let client = await clientService.validate(client_id, redirect_uri, scope);
        //验证用户
        let user = await userService.validate(username, password);
        //获取授权码
        let code = await authCode_repository.build_authenticate_code(user, client, scope, state);
        return code;
    },
    build_token: async (client_id, redirect_uri, client_secret, code) => {
        let authdata = await authCode_repository.finder_authenticate_code(client_id, code);
        if (authdata === null
            || authdata.client_id !== client_id
            || authdata.redirect_uri !== redirect_uri
            || authdata.client_secret !== client_secret) {
            //和上一步验证不匹配
            throw new BusinessError(500, '客户端验证失败')
        }
        //客户端验证成功，开始执行获取token任务
        let token = await token_repository.build_token();
        return token;
    }
}
module.exports = oauthService