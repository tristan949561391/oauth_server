/**
 * Created by Tristan on 17/3/19.
 */
module.exports.port = 3000

module.exports.mongoose = {
    url: 'mongodb://localhost/auth',
    options: {
        // db: {native_parser: true},
        // server: {poolSize: 5},
        // replset: {rs_name: 'myReplicaSetName'},
        // user: 'myUserName',
        // pass: 'myPassword'
    }
}


module.exports.redis={
    host:'localhost',
    port:6379,
    options:{

    }
}