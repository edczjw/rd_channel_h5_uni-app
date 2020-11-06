/**
 * 防抖节流封装   func：传入执行的函数   waitTime：时间    type：0-防抖   1-节流    immediate：true 表立即执行，false 表非立即执行
 * 防抖：非立即执行   立即执行   节流：稀释频率
 * */
/**
 * 函数防抖 (只执行最后一次点击)
 * @param fn
 * @param delay
 * @returns {Function}
 * @constructor
 */
export const Debounce = (fn, t) => {
    let delay = t || 500;
    let timer;
    console.log(fn)
    console.log(typeof fn)
    return function () {
        let args = arguments;
        if(timer){
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            timer = null;
            fn.apply(this, args);
        }, delay);
    }
};
/**
 * 函数节流
 * @param fn
 * @param interval
 * @returns {Function}
 * @constructor
 */
export const Throttle = (fn, t) => {
    let last;
    let timer;
    let interval = t || 500;
    return function () {
        let args = arguments;
        let now = +new Date();
        if (last && now - last < interval) {
            clearTimeout(timer);
            timer = setTimeout(() => {
                last = now;
                fn.apply(this, args);
            }, interval);
        } else {
            last = now;
            fn.apply(this, args);
        }
    }
};


//使用方式
// ...
// methods:{
// 	getAliyunData:Throttle(function(){
// 	...
// 	 },1000),
// }
// ...