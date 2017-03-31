/**
 * Created by Tristan on 17/3/27.
 */

const userModel = require('../model/user')
const BusinessError = require("../error/index").BusinessError;
let userService = {
    //验证用户名和密码，并返回对象
    validate: async (username, password) => {
        let user = await userModel.findByUsername(username);
        if (user === null) {
            throw new BusinessError(500, '没有该用户');
        }
        if (user.password !== password) {
            throw new BusinessError(500, '密码不正确')
        }
        return user;
    },
    register: async (username, password) => {
        let user = await userModel.findByUsername(username);
        if (user) throw new BusinessError(500, '用户已经存在');
        let data = {
            username: username,
            password: password
        }
        user = await userModel.insertUser(data);
        return user
    }
}
module.exports = userService