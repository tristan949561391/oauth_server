/**
 * Created by Tristan on 17/3/19.
 */
const Router = require('koa-router')
const userService = require('../service/user.service')
const ParamError = require('../error').ParamError;
const commonUtil = require('../utils')
const route = new Router().prefix('/user');
const authorization = require('../service/oauth.service').authorization;

route.use(authorization('profile_get'));

route.get('/profile.md', async (ctx) => {
    let userProfile = await userService.find_by_userId(ctx.user_id);
    let user = userProfile._doc;
    delete user.password;
    ctx.body = user;
});
module.exports = route;
