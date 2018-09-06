import {moment} from '@alife/next';

/**
 * 深克隆对象
 * @param {object} obj - 需要被克隆的对象
 * @return 已被克隆对象
 */
export const deepClone = (obj) => {
    return JSON.parse(JSON.stringify(obj));
}

/**
 * 非空
 * @param {any} obj - 判断对象
 * @return {bool}     返回对象
 */
export const isNotEmpty = (obj) => {
    if (obj === null || obj === undefined) {
        return false;
    } else {
        return true;
    }
};



/**
 * 生成 services
 * @param {object} configs services信息
 * @param {string} host url的域名
 */
export function getServices(configs, host="") {
    let res = {};
    for(let key in configs) {
        let config = configs[key];
        res[key] = {
            url: `${host}${config.url}`,
            method: config.method || 'get',
            timeout: config.timeout || 10000
        };
    }
    return res;
}

/**
 * 更新表单元素的attributes属性值
 * @param {array} items 查询区域的节点列表
 * @param {object} values 属性值的集合
 * @param {string} attr 需要更新的属性
 */
export function updateFormItemsAttribute(items = [], values = {}, attr="dataSource") {
    return items.forEach(item => {
        if(item.attributes.id && values[item.attributes.id] !== undefined) {
            item.attributes[attr] = values[item.attributes.id];
        }
        return item;
    });
};

/**
 * 将日期对象转换为字符串/字符串数组，
 * @method parseDateString
 * @param  {date/string/[date]/[string]}    value            日期对象
 * @param  {string}                         fromat           格式化数组[format='YYYY/MM/DD']
 * @return {string/[string]}                                 日期字符串或者日期字符串的数组
 */
export const parseDateString = (value, format='YYYY/MM/DD') => {
    let result = '';
    if (Array.isArray(value)) {
        result = [];
        for (let i = 0, length = value.length; i < length; i++) {
            if (isNotEmpty(value[i]) && value[i] !== 'Invalid date') {
                result.push(moment(value[i]).format(format));
            }
            else {
                result.length = 0;
                break;
            }
        }
        return result;
    }
    else if (value === 'Invalid Date'){
        return '';
    }
    return moment(value).format(format);
};

export const isNotEmptyArray = (value) => {
    if (isNotEmpty(value) && Array.isArray(value) && value.length > 0) {
        return true;
    }
    else {
        return false;
    }
}
