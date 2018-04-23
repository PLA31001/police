const redis = require('redis');
const config = require('../config/config');
const https = require('https');
const crypto = require('crypto');
let WXBizDataCrypt = require('./WXBizDataCrypt')

let auth = {};
/**
 * 连接redis数据库
 * @param {function} callback 
 */
function redisConnect(callback) {
    let redisConfig = config.database.redis;
    let client = redis.createClient(6379, redisConfig.host);
    client.on("error", (err)=>{
        throw new ReferenceError('数据库连接失败');
    });
    return client;
}

/**
 * 微信登录
 * @param {String} code  
 * @param {function} callback 
 */
auth.wxLogin = (code, callback) => {
    if ( code === undefined ) {
        throw new ReferenceError('code参数未传递');
    }

    // https://api.weixin.qq.com/sns/jscode2session?appid=APPID&secret=SECRET&js_code=JSCODE&grant_type=authorization_code
    let appid = config.wx.appid, secret = config.wx.secret;

    let url = 'https://api.weixin.qq.com/sns/jscode2session?appid='+ appid +'&secret=' + secret + '&js_code=' + code + '&grant_type=authorization_code';
    let req = https.get(url, res => {
                    let d = [];
                    res.on('data', data => {
                        d.push(data);
                    });
                    res.on('end', () => {
                        let data = JSON.parse(d.toString());
                        if ( data.errcode ) {
                            callback(data.errcode + ":" + data.errmsg);
                            return;
                        } else {
                            callback(null, data);
                        }
                    });
                });

    // 错误处理
    req.on('error', (err) => {
        console.log(err);
        callback(err);
    });
}

/**
 * 获取解密后的用户数据
 * @param {string} encryptedData 
 * @param {string} iv 
 * @param {string} sessionKey 
 */
auth.wxUserInfoDecryption = (encryptedData, iv, sessionKey) => {
    // 参数非空验证
    if ( encryptedData === undefined ) {
        throw new ReferenceError('encryptedData不存在');
    } else if ( iv === undefined ) {
        throw new ReferenceError('iv不存在');
    } else if ( sessionKey === undefined ) {
        throw new ReferenceError('sessionKey不存在');
    }

    var appId = config.wx.appid;
    var pc = new WXBizDataCrypt(appId, sessionKey)
    var data = pc.decryptData(encryptedData , iv)

    return data;
}

/**
 * 检查请求的合法性
 * @param {string} id 
 * @param {string} sign 
 * @param {number} timeStamp 
 */
auth.checkLogin = (id, sign, timeStamp, callback) => {
    // 验证请求时否超时
    let nowTime = Date.now();
    if ( nowTime - parseInt(timeStamp) > 30000 ) {
        return callback('请求超时');
    }

    try {
        let redisClient = redisConnect(); 
        redisClient.hgetall(id, ( err, data) => {
            if ( err ) {
                throw new Error(err);
            }
            
            if (data === null ) {
                return callback('用户未登录');
            }

            let token = data.token;
            let signStr = crypto.createHash('md5')
                                .update("id=" + id + "&timeStamp=" + timeStamp + "&token=" + token)
                                .digest('hex');
            if ( signStr !== sign) {
                return callback('请求不合法');
            } else {
                redisClient.quit();
                return callback(true);
            }
        });  
    } catch (error) {
        throw new ReferenceError(error);
    }
}

module.exports = auth;