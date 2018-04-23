var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var swig = require('swig');
var mongoose = require('mongoose');
var config = require('./config/config');
var log4js = require('log4js');
var redis = require('redis');

log4js.configure('config/log4js.json');
let log = log4js.getLogger('error');

/**
 * 连接mongodb数据库
 */
var dbConfig = config.database.mongodb;
var dbUrl = 'mongodb://' + dbConfig.host + ':' + dbConfig.port + '/' + dbConfig.dbname;
mongoose.connect(dbUrl, (err)=>{
  if (err) {
      log.error('数据库连接失败：' + err);
      console.log('数据库连接失败：' + err);
  } 
});

/**
 * 连接redis数据库
 */
var redisConfig = config.database.redis;
var client = redis.createClient(6379, redisConfig.host);
client.on("error", (err)=>{
  log.error('redis连接失败：' + err);
  console.log('redis连接失败：' + err);
});

/**
 * 引入路由文件
 */
var users = require('./routes/api/users');
var managers = require('./routes/managers/index');
//var api_managers = require('./routes/api/managers');

var app = express();

app.use((req, res, next)=>{
  res.redis = client;
  next();
});

// 模板配置
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', swig.renderFile);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/**
 * 路由
 */
app.get('/api/time', (req, res, next) => {
  return res.json({
    status : 200,
    msg : "获取成功",
    data : {
      time : Date.now()
    }
  });
});
app.use('/api/users', users);
app.use('/admin', managers);
//app.use('/api/managers', api_managers);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// 错误处理中间件
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  console.log(err);
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send(err);
});

module.exports = app;
