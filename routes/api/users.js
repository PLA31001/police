let express = require('express');
let log4js = require('log4js');
let usersModel = require('../../model/Users');
let func = require('../../common/func');
let validate = require('../../common/validate');
let authorization = require('../../middleware/authorization');
let auth = require('../../model/auth');

// log4js配置
log4js.configure('config/log4js.json');
let logger = log4js.getLogger('error');
let defaultLogger = log4js.getLogger();

let router = express.Router();



/**
 * 微信登录
 */
router.post('/login', (req, res, next) => {
    // 参数处理
    let code, encryptedData, iv;
    code = req.body.code || '';
    encryptedData = req.body.encryptedData || '';
    iv = req.body.iv || '';

    if ( code == '' || encryptedData == '' || iv == '' ) {
        return next({
            status : 500,
            msg : "缺少所需参数"
        });
    }

    // 调用登录接口
    auth.wxLogin(code, (err, d) => {
        if (err) {
            logger.error('微信登录失败 ' + err);
            return next({
                status : 500,
                msg : '微信登录失败'
            });
        }

        let sessionKey = d.session_key;
        let openId = d.openid;
        let userData;// 添加用户完后返回的用户数据
        let userInfo;// 解密后的用户数据

        // 查询用户是否被添加
        usersModel.findOne({openId, isDeleted : false})
                    .then( user => {
                        if ( user === null ) {
                            // 当用户不存在，添加该用户
                            try {
                                userInfo = auth.wxUserInfoDecryption(encryptedData, iv, sessionKey);   
                            } catch (error) {
                                logger.error(error);
                                return Promise.reject({
                                            status : 500,
                                            msg : "登录失败"
                                        });
                            }
                            let newUser = new usersModel({
                                openId,
                                username : userInfo.nickName,
                                sex : userInfo.gender,
                                picture : userInfo.avatarUrl
                            });
                            return newUser.save();
                        } else if (user.status === 0) {
                            // 检查用户是否被停用
                            return Promise.reject({
                                    status : 403,
                                    msg : "该用户已被停用"
                                });
                        } else {
                            return Promise.resolve(user);
                        }
                    } )
                    .then(userData => {
                        // 在redis中缓存用户登录凭证
                        let token =  func.getTokenStr(sessionKey, openId);;
                        res.redis.hmset(userData._id, {
                            type : 3,
                            token,
                            sessionKey,
                            openId
                        }, (err, reply) => {
                            if (err) {
                                logger.error('redis写入缓存失败 ' + err);
                                return Promise.reject({
                                        status : 500,
                                        msg : '微信登录失败'
                                    });
                            }
                            res.redis.expire(userData._id, 1*24*3600);// 设置缓存过期时间
                            return res.json({
                                status : 200,
                                msg : "登录成功",
                                data : {
                                    _id : userData._id,
                                    username : userData.username,
                                    sex : userData.sex,
                                    age : userData.age,
                                    tel : userData.tel,
                                    email : userData.email,
                                    picture : userData.picture,
                                    addTime : userData.addTime,
                                    updateTime : userData.updateTime,
                                    token
                                }
                            });
                        });                        
                    })
                    .catch(err => {
                        if (typeof err !== 'object'){
                            logger.error('mongodb写入数据失败 ' + err);
                            err = {
                                status : 500,
                                msg : '微信登录失败'
                            }
                        }
                        next(err);// 将错误抛向错误处理中间件
                    });
    });
});

/**
 * 加载用户验证中间件
 */
router.use(authorization);

/**
 * 更新一个用户的数据
 */
router.post(/^\/[0-9a-zA-Z]+$/, (req, res, next) => {
    let _id = req.path.split('/')[1];
    usersModel.findOne({_id, isDeleted : false})
              .then(queryResult => {
                    if ( queryResult === null ) {
                        return Promise.reject({
                            status : 404,
                            msg : '用户不存在'
                        });
                    } else if ( queryResult.status === 0 ) {
                        // 检查用户是否被停用
                        return Promise.reject({
                            status : 403,
                            msg : "该用户已被停用"                            
                        });
                    } else { 
                        // 收集用户发送过来的信息
                        let newUserInfo = {};
                        let userInfoKey = ['tel', 'email', 'sex', 'age', 'openId', 'picture', 'status', 'isDeleted'];
                        userInfoKey.forEach((val, key) => {
                            req.body.hasOwnProperty(val) && (newUserInfo[val] = req.body[val]);
                        });
                        // 检测请求信息格式
                        let validateRes = validate(newUserInfo);
                        if ( validateRes !== true ) {
                            return Promise.reject({
                                status : 406,
                                msg : validateRes
                            });
                        }
                        newUserInfo.updateTime = Date.now();
                        // 更新数据
                        return usersModel.update({_id, isDeleted : false}, newUserInfo);
                    }
              })
              .then(query => {
                    if ( query.ok === 0) {
                        return Promise.reject({
                            status : 500,
                            msg : '更新失败'
                        });
                    }
                    return usersModel.findOne({_id, isDeleted : false});
              })
              .then(updateResult => {
                    // 装配返回数据
                    let resData = {status : 200, msg : '更新成功', data : {}},
                        resKey = ['_id', 'tel', 'email', 'sex', 'age', 'picture', 'username', 'addTime', 'updateTime'];
                    resKey.forEach((val) => {
                        resData.data[val] = updateResult[val];
                    });
                    return res.json(resData);
              })
              .catch(err => {// 错误处理
                if ( typeof err !== 'object' ) {
                    logger.error("数据库错误：" + err);
                    err = {
                        status : 500,
                        msg : '服务器内部错误'
                    }
                }
                return next(err);
              });
});

module.exports = router;