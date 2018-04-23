/**
 * 检测各种数据格式是否正确
 */
function valdate (obj) {
    if (typeof obj !== 'object' ) {
        throw new TypeError('参数必须是一个object');
    }
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            switch (key) {
                case 'tel':// 验证电话号码
                    if ( !/^1[3|4|5|8][0-9]\d{4,8}$/.test(obj[key]) ){
                        return '手机号码格式不正确';
                    };
                    break;
                case 'email':
                    if ( !/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/.test(obj[key]) ) {
                        return '邮箱格式不正确';
                    }
                    break;
                case 'sex':
                    if ( !/^(1|2)$/.test(obj[key]) ) {
                        return '性别数据格式不正确';
                    }
                    break;
                case 'age':
                    if ( !/^([1-9][0-9]|[1-9]{1}|100)$/.test(obj[key]) ) {
                        return '年龄格式或范围不正确';
                    }
                    break;
                case 'status':
                    if ( !/^(1|0)$/.test(obj[key]) ) {
                        return '状态格式不正确';
                    }
                    break;
            }
        }
    }
    return true;
}

module.exports = valdate;