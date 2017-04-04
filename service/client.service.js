/**
 * Created by Tristan on 17/3/27.
 */

const codeUtils = require('../utils').codeUtil
const Errors = require('../error');
const clientModel = require('../model/client')
const commonUtil = require('../utils');

/**
 * 注册客户端（临时方法）
 * @param client_name
 * @param redirect_uri
 * @returns {Promise}
 */
async function register(client_name, redirect_uri) {
    console.log('client_service-register')
    let data = {
        client_name: client_name,
        client_id: codeUtils.client_id_builder(),
        client_secret: codeUtils.client_secret_builder(),
        auth_type: ['passoword', 'authenticate_code'],
        create_time: new Date(),
        scope: 'read',
        redirect_uri: redirect_uri
    }
    return await clientModel.insertClient(data);
}


/**
 * 验证客户端的合法性
 * @param client_id
 * @param redirect_uri
 * @param scope
 * @returns {Promise.<*>}
 */
async function validate(client_id, redirect_uri, scope) {
    let client = await clientModel.findByClientId(client_id);
    if (client === null) {
        throw new Errors.BusinessError(500, '找不到对应授权的客户端');
    }
    if (client.redirect_uri !== redirect_uri) {
        throw new Errors.BusinessError(500, '重定向地址错误');
    }
    let scopeAllInclude = await commonUtil.include(client.scope, scope, ',');
    if (!scopeAllInclude) {
        throw new Errors.BusinessError(500, '无法匹配对应的scope权限');
    }
    return client;
}

module.exports = {
    register: register,
    validate: validate
};