/**
 * Created by Tristan on 17/3/27.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const conn = require('./conn/mongoose')

const clientSchema = new Schema({
    client_name: String,
    client_id: String,
    client_secret: String,
    auth_type: Array,
    create_time: Date,
    scope: String,
    redirect_uri: String
});

clientSchema.statics.findByClientId = (client_id) => {
    return new Promise((r, j) => {
        Client.findOne({"client_id": client_id}, (err, client) => {
            console.log(client)
            if (err != null || client == null) {
                j(new Error('client not find'))
            }
            r(client)
        })
    })
}

clientSchema.statics.insertClient = async (client) => {
    return new Promise((resove, reject) => {
        Client.findOne({"client_id": client.client_id}, (err, clientFind) => {
            if (err) {
                reject(err)
            }
            if (clientFind != null) {
                reject(new Error('clien_id have already'))
            }
            let clientEntity = new Client(client)
            clientEntity.save((err, data) => {
                if (err || data == null) {
                    reject(new Error('insert falure'))
                }
                resove(data);
            })
        })
    })
}

const Client = conn.model('client_table', clientSchema);
module.exports = Client












