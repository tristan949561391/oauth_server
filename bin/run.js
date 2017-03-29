const app = require('../app');
const http = require('http')
const conf = require('../conf')
http.createServer(app.callback()).listen(conf.port, () => {
    console.log(`服务器启动成功：端口${conf.port}`)
})
