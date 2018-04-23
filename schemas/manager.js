const mongoose = require('mongoose');

const managerSchema = new mongoose.Schema({
    username : {
        type : String,
        default : ''
    },
    password : {
        type : String,
        default : ''
    },
    realName : {
        type : String,
        default : ''
    },
    tel : {
        type : String,
        default : ''
    },
    email : {
        type : String,
        default : ''
    },
    lastLoginDate : {
        type : Date,
        default : new Date()
    },
    addTime : {
        type : Date,
        default : new Date()
    },
    updateTime : {
        type : Date,
        default : new Date()
    },
    isAdmin : {
        type : Boolean,
        default : false
    },
    isDeleted : {
        type : Boolean,
        default : false
    },
    status : {
        type : Number,
        default : 1
    }
});

module.exports = managerSchema;