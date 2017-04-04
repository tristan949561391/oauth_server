/**
 * Created by Tristan on 2017/3/29.
 */
const Koa = require('koa');
const app = new Koa();
const staticCache = require('koa-static-cache');
const path = require('path');
const bodyparser = require('koa-bodyparser');
const Logger = require('koa-logger');
const view = require('koa-views');
const convert = require('koa-convert');
const cors = require('koa2-cors');


//-------midleware
app.use(bodyparser());
app.use(Logger());
app.use(cors());
app.use(convert(staticCache(path.join(__dirname, 'static/dist'), {
    maxAge: 365 * 24 * 60 * 60
})));
app.use(view(path.join(__dirname, 'view'), {
    extension: 'html',
    map: {
        html: 'ejs'
    }
}));
app.use(async (ctx, next) => {
    try {
        await next()
    } catch (e) {
        console.error(e.message);
        console.error(e.stack);
        ctx.status = 500;
        ctx.body = {status: e.code || 500, message: e.message, name: e.name}
    }
});

const route_client = require('./router/client.route');
app.use(route_client.routes()).use(route_client.allowedMethods());
const route_oauth = require('./router/oauth.router');
app.use(route_oauth.routes()).use(route_oauth.allowedMethods());
const route_user = require('./router/user.route');
app.use(route_user.routes()).use(route_oauth.allowedMethods());
const route_test = require('./router/test.route');
app.use(route_test.routes()).use(route_test.allowedMethods());
const route_home = require('./router/home.route');
app.use(route_home.routes()).use(route_home.allowedMethods());


app.use(async (ctx) => {
    await  ctx.render('index')
});
module.exports = app;