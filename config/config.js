module.exports = {
    /**
     * 全局配置
     */
    global : {},

    /**
     * 数据库配置
     */
    database : {
        mongodb : {
            host : 'police_db',
            dbname : 'police',
            port : 27017 
        },
        redis : {
            host : "police_cache"
        }
    },

    /**
     * 微信的配置
     */
    wx : {
        appid : 'wx6f9eafcaafe084ea',
        secret : 'ff231f1acafff6498538617a3f907be4'
    },

    /**
     * 状态码配置
     */
    code : {}
}