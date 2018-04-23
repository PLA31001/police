const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    openId : {
        type : String,
        default : ''
    },
    username : {
        type : String,
        default : ''
    },
    sex : {
        type : Number,
        default : 1
    },
    age : {
        type : Number,
        default : 18
    },
    tel : {
        type : String,
        default : ''
    },
    email : {
        type : String,
        default : ''
    },
    picture : {
        type : String,
        default : ''
    },
    addTime : {
        type : Date,
        default : new Date()
    },
    updateTime : {
        type : Date,
        default : new Date()
    },
    status : {
        type : Number,
        default : 1 // 1未正常，0为停用
    },
    isDeleted : {
        type : Boolean,
        default : false
    }
});

module.exports = userSchema;