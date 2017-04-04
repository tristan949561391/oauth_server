/**
 * Created by Tristan on 17/3/27.
 */
const mongoose = require('mongoose');
const config = require('../../conf');
mongoose.Promise = global.Promise;
const mongo = mongoose.createConnection(config.mongoose.url, config.mongoose.options);
mongo.once('open', function () {
    console.log(`mongodb数据库连接成功${config.mongoose.url}`)
});
mongo.on('error', function () {
    console.error('mongo 数据库连接失败');
});
module.exports = mongo;
