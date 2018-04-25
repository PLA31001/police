const mongoose = require('mongoose');

/**
 * 事件视频
 */
const vedio = new mongoose.Schema({
    path : String,
    addTime : {
        type : Date,
        default : new Date()
    }
});

/**
 * 事件图片
 */
const photo = new mongoose.Schema({
    path : String,
    addTime : {
        type : Date,
        default : new Date()
    }
});

const eventSchema = new mongoose.Schema({
    position :{
        type : [Number]
    },
    photos : {
        type : [photo],
        default : []
    },
    vedios : {
        type : [vedio],
        default : []
    },
    type : {
        type : Number,
        default : 1 // 1匪警2火警3急救
    },
    sendUser : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'user'
    },
    hanlder : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'manager'
    },
    addTime : {
        type : Date,
        default : new Date()
    },
    status : {
        type : Number,
        default : 1 // 1->未受理 2->受理中 3->已解决 4->已关闭
    },
    updateTime : {
        type : Date,
        default : new Date()
    },
    isHistory : {
        type : Boolean,
        default : false
    },
    isDeleted : {
        type : Boolean,
        default : false
    }
});

module.exports = eventSchema;