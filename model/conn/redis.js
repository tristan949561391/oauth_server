/**
 * Created by Tristan on 17/3/27.
 */
const redis = require("redis");
const config = require('../../conf');
const client = redis.createClient(config.redis.port, config.redis.host, config.redis.options);

client.on('connect', () => {
    console.log(`redis 连接成功${config.redis.host}:${config.redis.port}`)
})

client.on("error", function (err) {
    console.error('redis 连接失败')
});
module.exports = client