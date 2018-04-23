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
            host : 'localhost',
            dbname : 'police',
            port : 27017 
        },
        redis : {
            host : "192.168.99.100"
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