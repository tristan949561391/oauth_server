/**
 * Created by Tristan on 2017/3/28.
 */
const Util = {
    parse_url: /(https?|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/,
    parse_mobile: /^1[0-9]{10}$/,

    isEmpty: function (str) {
        if (str == null || str.length == 0) {
            return true;
        }
        return false;
    }
    ,
    notEmpty: function (str) {
        return !this.isEmpty(str)
    }
    ,
    haveEmpty: function async(strs) {
        return new Promise((resove, reject) => {
            let res = false;
            for (let i = 0; i < strs.length; i++) {
                if (this.isEmpty(strs[i])) {
                    res = true;
                    break;
                }
            }
            resove(res);
        })
    }
    ,
    isUrl: function (str) {
        if (this.isEmpty(str)) return false;
        if (this.parse_url.test(str)) return true;
        return false;
    },
    isMobile: function (str) {
        if (this.isEmpty(str)) return false;
        if (this.parse_mobile.test(str)) return true;
        return false;
    },
    isPassword: function (str) {
        if (this.isEmpty(str))return false;
        if (str.length <= 6) return false;
        return true;
    }
}
module.exports = Util
module.exports.codeUtil = require('./codeUtil')