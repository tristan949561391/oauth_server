/**
 * Created by Tristan on 17/3/19.
 */
const Router = require('koa-router')
const ClientService = require('../service/client.service')
const ParamError = require('../error').ParamError;
const commonUtil = require('../utils')
const route = new Router().prefix('/test');
const request = require('request')
let client_id = 'f093804f-da57-42f5-8096-40cc7d0055cb';
let redirect_uri = 'http://localhost:3000/test/callback.md'
route.get('/callback.md', async (ctx) => {
    let code = ctx.query.code;
    let secret = '7cd408ea-72ac-4844-a187-c0a07dadc0ee';
    let body = await getAccessToken(client_id, secret, code)
    ctx.body = await JSON.stringify(body);
})
let getAccessToken = (client_id, client_secret, code) => {
    return new Promise((resove, reject) => {
        let op = {
            url: 'http://moondust.cc:443/oauth/access_token.md',
            form: {
                client_id: client_id,
                client_secret: client_secret,
                code: code,
                redirect_uri: redirect_uri
            }
        };
        request.post(op, function (err, httpResponse, body) {
            if (err) reject(err);
            resove(JSON.parse(body))
        })
    })
}

const oauthServer=require('../service/oauth.service')

route.get('/', async (ctx) => {
    let token = await  oauthServer.build_token('f093804f-da57-42f5-8096-40cc7d0055cb', 'http://localhost:3000/test/callback.md', '7cd408ea-72ac-4844-a187-c0a07dadc0ee', 4561)
    ctx.body=token;
})

module.exports = route
