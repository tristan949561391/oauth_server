/**
 * Created by Tristan on 17/3/29.
 */
const Router = require('koa-router');
const utils = require('../utils');
const ParamError = require('../error').ParamError;
const clientService = require('../service/client.service');
const oauthService = require('../service/oauth.service');


const router = new Router().prefix('/api/oauth');
module.exports = router;

/**
 * 验证客户端的合法性，
 * redirect_uri回掉地址，这个地址必须和签约是约定的回掉地址一致，否则会报错，可以在控制台中修改回掉地址
 * client_id客户端的id ，和平台签约的时候所约定的唯一的客户端id
 * scope客户端要使用的权限，签约的时候所拥有的权限，可以是多个值
 *
 * 返回客户端的详细信息
 */
router.post('/client/validate.md', async (ctx) => {
    let redirect_uri = ctx.request.body.redirect_uri;
    if (!utils.isUrl(redirect_uri)) {
        throw new ParamError(1000, 'redirect_uri不合法')
    }
    let client_id = ctx.request.body.client_id;
    if (utils.isEmpty(client_id)) {
        throw new ParamError(1000, 'client_id不可为空');
    }
    let scope = ctx.request.body.scope;
    if (utils.isEmpty(scope)) {
        throw new ParamError(1000, 'scope 不能为空');
    }
    //----------------------------------------
    let client = await  clientService.validate(client_id, redirect_uri, scope);
    let data = client._doc;
    delete data.client_secret;
    ctx.body = data;
});

/**
 * 授权的请求地址，以redirect_uri,client_id,scope,state,username,password这几个值来换取客户端临时授权码
 *  * redirect_uri回掉地址，这个地址必须和签约是约定的回掉地址一致，否则会报错，可以在控制台中修改回掉地址
 * client_id客户端的id ，和平台签约的时候所约定的唯一的客户端id
 * scope客户端要使用的权限，签约的时候所拥有的权限，可以是多个值
 * username用户的登陆名
 * password用户的登陆密码
 *
 * 返回临时授权码
 */
router.post('/authorize.md', async (ctx) => {
    let redirect_uri = ctx.request.body.redirect_uri;
    if (!utils.isUrl(redirect_uri)) {
        throw new ParamError(1000, 'redirect_uri不合法');
    }
    let client_id = ctx.request.body.client_id;
    if (utils.isEmpty(client_id)) {
        throw new ParamError(1000, 'client_id不可为空');
    }
    let scope = ctx.request.body.scope;
    if (utils.isEmpty(scope)) {
        throw new ParamError(1000, 'scope 不能为空');
    }
    let state = ctx.request.body.state || -1;
    let username = ctx.request.body.username;
    if (utils.isEmpty(username)) {
        throw new ParamError(1056, '用户名不可为空')
    }
    let password = ctx.request.body.password;
    if (utils.isEmpty(password)) {
        throw new ParamError(1057, '密码不可为空')
    }
    //----------------------------------------
    //构建出验证的code
    let authenticate_code = await oauthService.build_authenticate_code(client_id, redirect_uri, scope, username, password);
    //code构建成功，重定向到预先定义的重定向地址，并将获取的code返回
    ctx.body = {code: authenticate_code, state: state};
});

/**
 * 使用临时的授权码（code）和client_id,client_secret,redirect_uri,scope来换取用户的令牌信息
 *  *  * redirect_uri回掉地址，这个地址必须和签约是约定的回掉地址一致，否则会报错，可以在控制台中修改回掉地址
 *  *  *client_id客户端的id ，和平台签约的时候所约定的唯一的客户端id
 *  *  *scope客户端要使用的权限，签约的时候所拥有的权限，可以是多个值
 *
 * 返回用户的token{
 *    access_token:用户的执行令牌
 *    fresh_token:用户的刷新令牌
 *    exprie:6000:执行令牌过期时间
 * }
 */
router.post('/access_token.md', async (ctx) => {
    let redirect_uri = ctx.request.body.redirect_uri;
    if (!utils.isUrl(redirect_uri)) {
        throw new ParamError(1000, 'redirect_uri不合法')
    }
    let client_id = ctx.request.body.client_id;
    if (utils.isEmpty(client_id)) {
        throw new ParamError(1000, 'client_id不可为空');
    }
    let client_secret = ctx.request.body.client_secret;
    if (utils.isEmpty(client_secret)) {
        throw new ParamError(1000, 'client_secret不可为空');
    }
    let code = ctx.request.body.code;
    if (utils.isEmpty(code)) {
        throw new ParamError(1085, 'code 不可为空')
    }
    //-----------------------------------------------------------
    ctx.body = await oauthService.build_token_by_code(client_id, redirect_uri, client_secret, code);
});


/**
 * 刷新令牌
 */
router.post('/fresh_token.md', async (ctx) => {
    let client_id = ctx.request.body.client_id;
    if (utils.isEmpty(client_id)) {
        throw new ParamError(1000, 'client_id不可为空');
    }
    let client_secret = ctx.request.body.client_secret;
    if (utils.isEmpty(client_secret)) {
        throw new ParamError(1000, 'client_secret不可为空');
    }
    let fresh_token = ctx.request.body.fresh_token;
    if (utils.isEmpty(fresh_token)) {
        throw new ParamError(1000, 'fresh token不可为空');
    }
    //--------------------------
    ctx.body = await oauthService.fresh_token(client_id, client_secret, fresh_token);
});


/**
 * password获取令牌
 */
router.post("/authorize_pass.md", async (ctx) => {

    let client_id = ctx.request.body.client_id;
    if (utils.isEmpty(client_id)) throw new ParamError(1000, "client_id 不能为空");
    let client_secret = ctx.request.body.client_secret;
    if (utils.isEmpty(client_secret)) throw new ParamError(1000, "client_secret不能为空");
    let scope = ctx.request.body.scope;
    if (utils.isEmpty(scope)) throw new ParamError(1000, "scope不能为空");
    let username = ctx.request.body.username;
    if (utils.isEmpty(username))throw new ParamError(1001, '用户名不能为空');
    let password = ctx.request.body.password;
    if (utils.isEmpty(password))throw new ParamError(1002, '密码不能为空');

    ctx.body = await oauthService.build_token_by_password(client_id, client_secret, scope, username, password);
});
