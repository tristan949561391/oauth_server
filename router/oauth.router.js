/**
 * Created by Tristan on 17/3/29.
 */
const Router = require('koa-router');
const router = new Router().prefix('/oauth')
module.exports = router


router.get('/authration.md', async (ctx) => {
    let url = ctx.originalUrl.replace('?', ';');
    console.log(url)
    ctx.redirect(url);
    ctx.status = 301;
})
