let queryString = require('querystring');
let auth = require('../model/auth');
/**
 * 用户认证中间件
 * @param {object} req 
 * @param {object} res 
 * @param {function} next 
 */
function authorization(req, res, next) {
        // 获取验证信息
        let authorization = req.headers.authorization;
        let authorizationObj = queryString.parse(authorization);
        
        // 验证信息非空校验
        if ( authorizationObj.sign === undefined || 
             authorizationObj.timeStamp === undefined ||
             authorizationObj.id === undefined ) {
            return next({
                status : 401,
                msg : "缺少验证头信息"
            });
        }
    
        let sign = authorizationObj.sign,
            timeStamp = authorizationObj.timeStamp,
            id = authorizationObj.id;
    
        // 验证
        try {
            auth.checkLogin(id, sign, timeStamp, (result) => {
                if ( result !== true ) {
                    defaultLogger.info(result);
                    return next({
                        status : 403,
                        msg : result
                    });
                } else {
                    next();
                }
            });
        } catch (error) {
            logger.error(error);
            return next({
                status : 500,
                msg : "服务器内部错误"
            });
        }
}

module.exports = authorization;