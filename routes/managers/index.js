let mongoose = require('mongoose');
let log4js = require('log4js');
let express = require('express');
let auth = require('../../model/auth');

let router = express.Router();

router.get('/test', (req, res, next) => {
    res.redis.set('test', 'test', (err, reply)=> {
        console.log(res);
        console.log(reply);
    });
    res.end();
});

module.exports = router;