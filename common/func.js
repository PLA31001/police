let crypto = require('crypto');
let func = {};

/**
 * 得到随机字符串
 * @param {number} len 
 */
func.randomString = function (len) {
　　len = len || 32;
　　var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
　　var maxPos = $chars.length;
　　var pwd = '';
　　for (i = 0; i < len; i++) {
　　　　pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
　　}
　　return pwd;
}

/**
 * 获取token
 */
func.getTokenStr = function(sessionKey, openid) {
    return crypto.createHmac('sha256', 'police')
                 .update(sessionKey + openid)
                 .digest('hex')
                 .toString();
}

module.exports = func;