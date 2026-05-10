export default {

    /**
     * 过滤字符串中的表情符合
     * @param val:string 
     * @returns
     * @memberof CommonPublicMethod
     */
    EmoticonFilteringFun(val: string, target: string = '') {
        let reg = /[^\u0020-\u007E\u00A0-\u00BE\u2E80-\uA4CF\uF900-\uFAFF\uFE30-\uFE4F\uFF00-\uFFEF\u0080-\u009F\u2000-\u201f\u2026\u2022\u20ac\r\n]/g;
        return val.replace(reg, target);
    },

    /**
     * 身份证号验证
     * @param val:string 
     * @returns
     * @memberof CommonPublicMethod
     */
    IdCardCheckFun(val: string) {
        let reg = /^[1-9]\d{5}(?:18|19|20)\d{2}(?:0[1-9]|10|11|12)(?:0[1-9]|[1-2]\d|30|31)\d{3}[\dXx]$/
        if (reg.test(val)) {
            return true;
        } else {
            return false;
        }
    },
    /**
     * 字母或数字
     * @param val:string 
     * @returns
     * @memberof CommonPublicMethod
     */
    ZmSzCheckFun(val: string) {
        let str = /^[a-zA-Z0-9]+$/i;
        if (str.test(val)) {
            return true;
        } else {
            return false;
        }
    },


    /**
     * 整数或小数
     * @param val:string 
     * @returns
     * @memberof CommonPublicMethod
     */
    ZsXsCheckFun(val: string) {
        let str = /(^[1-9][0-9]*|^[0]{1})([\.][0-9]{1,6})?$/;
        if (str.test(val)) {
            return true;
        } else {
            return false;
        }
    },
}