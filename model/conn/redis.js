/**
 * Created by Tristan on 17/3/27.
 */
const redis = require("redis");
const config = require('../../../conf');
const client = redis.createClient(config.redis.port, config.redis.host, config.redis.options);
const logD = require('log4js').getLogger('debug');

client.on('connect', () => {
    logD.debug(`redis 连接成功${config.redis.host}:${config.redis.port}`)
})

client.on("error", function (err) {
    logD.error('redis 连接失败')
});
module.exports = client