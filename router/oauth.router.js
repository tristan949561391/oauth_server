/**
 * Created by Tristan on 17/3/29.
 */
const Router = require('koa-router');
const router = new Router().prefix('/oauth')
const utils = require('../utils');
const Errors = require('../error');
module.exports = router


router.get('/authration.md', async (ctx) => {
    let url = ctx.originalUrl.replace('?', ';');
    console.log(url)
    ctx.redirect(url);
    ctx.status = 301;
})


router.post('/client/validate', async (ctx) => {
    let redirect_uri = ctx.request.body.redirect_uri;
    let client_id = ctx.request.body.client_id;
    let scope = ctx.request.body.scope;
    if (await utils.haveEmpty([redirect_uri, client_id, scope])) {
        throw new Errors.ParamError(1105, 'client validate error');
    }
    ctx.body = {
        state: 200,
        message: 'ok' + scope + client_id + redirect_uri
    }
})
