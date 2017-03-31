/**
 * Created by Tristan on 17/3/19.
 */
const Router = require('koa-router')
const ClientService = require('../service/client.service')
const ParamError = require('../error').ParamError;
const commonUtil = require('../utils')
const route = new Router().prefix('/test');
const request=require('request')
route.get('/callback.md', async (ctx) => {
    let code = ctx.query.code;
    let secret = 'c306d91e-b093-4a46-9a22-578b7e82a350';
    ctx.body={code:code,client_secret:secret};
})



let getAccessToken=async (client_id,client_secret,code)=>{
    request.post('http://localhost:3000/oauth/')

}

module.exports = route
