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
    },
    include: function (all, sub, split) {
        return new Promise(resolve => {
            let allArr = all.split(split);
            let subArr = sub.split(split);
            let sum = 0;
            for (let i = 0; i < allArr.length; i++) {
                for (let j = 0; j < subArr.length; j++) {
                    if (allArr[i] === subArr[j]) {
                        sum++;
                    }
                }
            }
            if (sum === subArr.length) {
                resolve(true);
            } else {
                resolve(false);
            }
        })

    },
    ArrayInclude: function (value, arrs) {
        return new Promise(resolve => {
            arrs.forEach(va => {
                if (va === value) {
                    resolve(true);
                }
            })
            resolve(false)
        })
    }
}
module.exports = Util
module.exports.codeUtil = require('./codeUtil')