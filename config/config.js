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
     * 对象存储cos的配置
     */
    cos : {
        secretId: 'AKIDP7kGrahSuFXhBk6TCqJdnFaq1AAC50nS',
        secretKey: 'hHzy3EVZr6A8TuEgHyXtO66zx1wbFmP4',
        appid: '1253679295',
        bucket: 'fgcos',
        // folder: 'police',  // 多次次签名一定不要带路径
        expiredTime : 60
    },
    /**
     * 状态码配置
     */
    code : {}
}