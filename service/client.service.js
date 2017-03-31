/**
 * Created by Tristan on 17/3/27.
 */

const codeUtils = require('../utils').codeUtil
const Errors = require('../error');
const clientModel = require('../model/client')
const clientService = {
    /**
     * 注册客户端（临时方法）
     * @param client_name
     * @param redirect_uri
     * @returns {Promise}
     */
    register: async (client_name, redirect_uri) => {
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
        let client = await clientModel.insertClient(data)
        return client;
    },


    /**
     * 验证客户端的合法性
     * @param client_id
     * @param redirect_uri
     * @param scope
     * @returns {Promise.<*>}
     */
    validate: async (client_id, redirect_uri, scope) => {
        let client = await clientModel.findByClientId(client_id);
        if (client && client.redirect_uri === redirect_uri && scope === client.scope) {
            return client;
        }
        throw new Errors.BusinessError(500, '客户端验证失败');
    }
}

module.exports = clientService