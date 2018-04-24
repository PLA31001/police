let express = require('express');
let authorization = require('../../middleware/authorization');
let queryString = require('querystring');
let eventsModel = require('../../model/Events');
let validate = require('../../common/validate');
let log4js = require('log4js');

log4js.configure('config/log4js.json');
let logger = log4js.getLogger('error');

let router = express.Router();

router.post('/test', (req, res, next) => {
    console.log(req.headers["content-type"]);
    console.log(req.body);
    res.end('ok');
});

/**
 * 加载用户验证中间件
 */
router.use(authorization);

/**
 * 增加事件
 */
router.post('/', (req, res, next)=> {
    if ( req.headers["content-type"] !== 'application/json' ) {
        return next({
            status : 406,
            msg : '请求数据格式错误'
        });
    }

    // 接受参数
    let userId = queryString.parse(req.headers.authorization).id,// 获取发送人id
        accept = ['position', 'photos', 'vedios', 'type', 'sendUser'],
        event = {};
    accept.forEach((val) => {
        req.body.hasOwnProperty(val) && ( event[val] = req.body[val] );
    });
    
    // 查询是否有未处理完的事件
    eventsModel.findOne({sendUser : userId, isDeleted : false, status: { $in : [1, 2] }})
               .then(findRes => {
                   if ( findRes !== null ) {
                       return next({
                           status : 409,
                           msg : '还有未处理完的事件'
                       });
                   } else {
                       // 验证数据格式是否正确
                        let validateRes = validate(event);
                        if ( validateRes !== true ) {
                            return next({
                                status : 406,
                                msg : validateRes
                            });
                        } else {
                            event.sendUser = userId;
                            let eventObj = new eventsModel(event);
                            return eventObj.save();
                        }
                   }
               })
               .then(newUser => {
                    let sendData = {},
                        accept = ['_id','position', 'photos', 'vedios', 'type', 'sendUser', 'addTime', 'status', 'updateTime', 'isHistory'];
                    accept.forEach(val => {
                        sendData[val] = newUser[val];
                    });
                    return res.json({
                        status : 200,
                        msg : '添加成功',
                        data : sendData
                    });
               })
               .catch(err=> {// 错误处理
                   if ( err.status === undefined ) {
                       logger.error("数据库错误:" + err);
                       err = {
                           status : 500,
                           msg : '服务器内部错误'
                       }
                   }
                   return next(err);
               });
});

/**
 * 获取事件列表
 */
router.get('/', (req, res, next)=> {
    // 整理参数
    let limit = 10,
        page = 1,
        condition = {},
        accept;
    req.query.limit 
        && (0 < parseInt(req.query.limit) && parseInt(req.query.limit) < 50)
        && ( limit = parseInt(req.query.limit));
    req.query.page 
        && ( parseInt(req.query.page) > 0 )
        && ( page = parseInt(req.query.page) );
    accept = ['sendUser', '_id', 'position', 'type', 'hanlder', 'status', 'isHistory', 'isDeleted'];
    accept.forEach(val => {
        req.query.hasOwnProperty(val) && ( condition[val] = req.query[val] );
    });

    // url请求参数转化为json
    for (const key in condition) {
        if (condition.hasOwnProperty(key)) {
            switch (condition[key]) {
                case 'position':
                    let arr = condition[key].split(',');
                    if ( arr.length !== 2 ) {
                        return next({
                            status : 406,
                            msg : 'position参数数据格式错误'
                        });
                    }else{
                        condition[key] = arr;
                    }
                    break;
                case 'isHistory':
                case 'isDeleted':
                    condition[key] = Boolean(condition[key]);
                    break;
            }
        }
    }

    // 验证格式
    let validateRes = validate(condition);
    if ( validateRes !== true ) {
        return next({
            status : 406,
            msg : validateRes
        });
    }

    // 查询数据库
    let eventList;
    eventsModel.find(condition)
               .skip((page - 1) * limit)
               .limit(limit)
               .then(events=>{
                   if ( events === null ) {
                       eventList = [];
                   } else{
                       eventList = events;
                   }

                   return res.json({
                       status : 200,
                       msg : '获取成功',
                       data : eventList
                   });
               })
               .catch(err=>{
                   logger.error('数据库错误：' + err);
                   err = {
                        status : 500,
                        msg : '服务器内部错误'
                   }
               });
});

module.exports = router;