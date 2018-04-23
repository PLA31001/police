const mongoose = require('mongoose');

/**
 * 事件视频
 */
const vedio = new mongoose.Schema({
    path : String,
    addTime : Date
});

/**
 * 事件图片
 */
const photo = new mongoose.Schema({
    path : String,
    addTime : Date
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
        default : 1
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
        default : new Data()
    },
    status : {
        type : Number,
        default : 1
    },
    updateTime : {
        type : Date,
        default : new Date()
    },
    isHistory : {
        type : Boolean,
        default : false
    }
});

module.exports = eventSchema;