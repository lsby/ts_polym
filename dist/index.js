"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.生成实现提供者 = exports.生成实现 = exports.跳过 = void 0;
exports.跳过 = Symbol();
function 柯里化调用(函数, 参数们) {
    var c = 函数;
    for (var x of 参数们) {
        c = c(x);
    }
    return c;
}
function 生成实现(实现池) {
    return (参数们) => {
        for (var i = 0; i < 实现池.length; i++) {
            var c = 柯里化调用(实现池[i], 参数们);
            if (c != exports.跳过)
                return c;
        }
        throw new Error('没有找到实现');
    };
}
exports.生成实现 = 生成实现;
function 生成实现提供者(实现池) {
    return (a) => 实现池.push(a);
}
exports.生成实现提供者 = 生成实现提供者;
//# sourceMappingURL=index.js.map