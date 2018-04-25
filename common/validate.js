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
                    if ( !/^1[3|4|5|8][0-9]\d{8}$/.test(obj[key]) ){
                        return '手机号码格式不正确';
                    };
                    break;
                case 'email':// 验证邮箱
                    if ( !/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/.test(obj[key]) ) {
                        return '邮箱格式不正确';
                    }
                    break;
                case 'sex':// 验证性别数据
                    if ( !/^(1|2)$/.test(obj[key]) ) {
                        return '性别数据格式不正确';
                    }
                    break;
                case 'age':// 验证年龄数据
                    if ( !/^([1-9][0-9]|[1-9]{1}|100)$/.test(obj[key]) ) {
                        return '年龄格式或范围不正确';
                    }
                    break;
                case 'status':// 验证状态数据
                    let acceptArr = [1,2,3,4];
                    if ( !acceptArr.includes(parseInt(obj[key])) ) {
                        return 'status参数格式错误';
                    }
                    break;
                case "position":
                    if ( !(obj[key] instanceof Array) || obj[key].length !== 2) {
                        return '地理位置数据格式不正确';
                    }
                    obj[key].forEach(val => {
                        if ( typeof val !== "number" ) {
                            return '地理位置数据格式不正确';
                        }
                    });
                    break;
                case 'photos':
                case 'vedios':
                    if ( !(obj[key] instanceof Array) ) {
                        return 'photos或vedios数据格式不正确';
                    }
                    obj[key].forEach(val => {
                        if ( typeof val !== 'object' ) {
                            return 'photos或vedios数据格式不正确'
                        } else if ( val.path === undefined ) {
                            return 'photos或vedios数据格式不正确';
                        } else if ( val.addTime === undefined || typeof val.addTime !== 'Number' ) {
                            return 'photos或vedios数据格式不正确';
                        }
                    });
                    break;
                case 'type':
                    let arr = [1,2,3];
                    if ( !arr.includes(obj[key]) ) {
                        return 'type格式错误';
                    }
                    break;
            }
        }
    }
    return true;
}

module.exports = valdate;