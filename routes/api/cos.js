let express = require('express');
let authorization = require('../../middleware/authorization');
let crypto = require('crypto');
let config = require('../../config/config');

let cosConfig = config.cos;

let router = express.Router();

/**
 * 加载用户验证中间件
 */

router.use(authorization);

/**
 * 获取上传cos验证信息
 */

router.get('/authorization', (req, res, next) => {

    
        let config = cosConfig;
    
        var folder = config.folder || '';
        if(folder && folder.indexOf('/') == 0) {
            folder = folder.substr(folder.indexOf('/')+1);
        }
    
        var appid = config.appid; // 开发者的项目 ID，即COS控制台密钥管理里的 APPID
        var bucket = config.bucket; // 空间名称 Bucket
        var secretID = config.secretId; // 项目的 Secret ID
        var secretKey = config.secretKey; // 项目的 Secret Key
        var expiredTime = config.expiredTime !== 0 ? ( parseInt(Date.now() / 1000) + parseInt(config.expiredTime) ) : 0; // 单次签名，e 必须设置为0；多次有效签名时，e 为签名的时间戳，单位是秒
        var currentTime = parseInt(Date.now() / 1000); // 当前时间戳，是一个符合 Unix Epoch 时间戳规范的数值，单位为秒
        var rand = parseInt(Math.random() * Math.pow(2, 32)); // 随机串，无符号10进制整数，用户需自行生成，最长 10 位
        var fileid = encodeURIComponent('/'+appid+'/'+bucket+'/'+folder); // 唯一标识存储资源的相对路径。格式为 /appid/bucketname/dirname/[filename]
    
        // 每个字段具体格式查看文档：https://www.qcloud.com/document/product/436/6054
        var plainText = 'a='+appid+'&k='+secretID+'&e='+expiredTime+'&t='+currentTime+'&r='+rand+'&f='+fileid+'&b='+bucket;
        var data = new Buffer(plainText,'utf8');
        var resStr = crypto.createHmac('sha1', secretKey).update(data).digest();
        var bin = Buffer.concat([resStr,data]);
        var sign = bin.toString('base64');
    
        return res.json({
            status : 200,
            msg : '获取成功',
            data : {
                sign
            }
        });
});

module.exports = router;
