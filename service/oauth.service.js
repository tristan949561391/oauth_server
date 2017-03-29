/**
 * Created by Tristan on 17/3/27.
 */
const clientModel = require('../entity/model/client')
let oauthService = {

    authenticate_code: async (clientId, redirect_uri, scope) => {
        let client = await clientModel.findByClientId(clientId);
        if (client.redirect_uri == redirect_uri && scope == client.scope) {
            return client
        }
        throw new Error('client err')
    },
}

module.exports = oauthService