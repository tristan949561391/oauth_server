/**
 * Created by Tristan on 17/3/27.
 */

const uuid = require('uuid')
const clientModel = require('../model/client')
const clientService = {
    register: async (client_name, redirect_uri) => {
        console.log('client_service-register')
        let client = await clientModel.insertClient({
            client_name: client_name,
            client_id: uuid.v4(),
            client_secret: uuid.v4(),
            auth_type: ['passoword', 'authenticate_code'],
            create_time: new Date(),
            scope: 'read',
            redirect_uri: redirect_uri
        })
        return client;
    }
}

module.exports = clientService