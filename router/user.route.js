/**
 * Created by Tristan on 17/3/19.
 */
const Router = require('koa-router')
const userService = require('../service/user.service')
const route = new Router().prefix('api/user');
const authorization = require('../service/oauth.service').authorization;

route.use(authorization('profile_get'));

route.get('/get_user.md', async (ctx) => {
    let userProfile = await userService.find_by_userId(ctx.user_id);
    let user = userProfile._doc;
    delete user.password;
    ctx.body = user;
});
module.exports = route;
