"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
var show实现池 = [];
var 提供show实现 = (0, index_1.生成实现提供者)(show实现池);
var show = (a) => (0, index_1.生成实现)(show实现池)([a]);
提供show实现((a) => {
    if (typeof a != 'number')
        return index_1.跳过;
    return a.toString();
});
提供show实现((a) => {
    if (typeof a != 'string')
        return index_1.跳过;
    return a.toString();
});
提供show实现((a) => {
    if (!Array.isArray(a))
        return index_1.跳过;
    return `[ ${a.map((a) => show(a)).join(', ')} ]`;
});
var x1 = show(1);
console.log(x1 == '1');
var x2 = show('a');
console.log(x2 == 'a');
var x3 = show([1, 2, 3]);
console.log(x3 == '[ 1, 2, 3 ]');
var map实现池 = [];
var 提供map实现 = (0, index_1.生成实现提供者)(map实现池);
var map = (f) => (a) => (0, index_1.生成实现)(map实现池)([f, a]);
提供map实现((f) => (x) => {
    if (!Array.isArray(x))
        return index_1.跳过;
    return x.map(f);
});
var x4 = map((a) => a + 1)([1, 2, 3]);
console.log(JSON.stringify(x4) == JSON.stringify([2, 3, 4]));
var pure实现池 = [];
var 提供pure实现 = (0, index_1.生成实现提供者)(pure实现池);
var pure = (a) => (0, index_1.生成实现)(pure实现池)([a]);
var Array_Type = 'Array';
提供pure实现((t) => (a) => {
    if (t != 'Array')
        return index_1.跳过;
    return [a];
});
var x5 = pure(Array_Type)(1);
console.log(JSON.stringify(x5) == JSON.stringify([1]));
//# sourceMappingURL=test.js.map