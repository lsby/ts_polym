import * as TF from '@lsby/ts_type_fun';
import { 取对象第一个键值, 取数组第一个, 联合转元组 } from '@lsby/ts_type_fun';
declare type 分解重载<T> = 联合转元组<{
    [P in keyof T as string]: {
        key: P;
        value: T[P];
    };
}['string']>;
declare type 选择分组<arr, 非错误 extends any[] = [], 错误 extends any[] = []> = arr extends [] ? {
    非错误: 非错误;
    错误: 错误;
} : arr extends [{
    key: infer key;
    value: infer value;
}, ...infer as] ? key extends string ? value extends TF.错误<any> ? 选择分组<as, 非错误, [...错误, {
    [p in key]: value;
}]> : 选择分组<as, [...非错误, {
    [p in key]: value;
}], 错误> : TF.错误<['key不是字符串', key]> : TF.错误<['输入不正确', arr]>;
export declare type 计算返回类型<A> = 选择分组<分解重载<A>> extends {
    非错误: infer 非错误;
    错误: infer 错误;
} ? 非错误 extends [] ? TF.错误<['没有找到正确的匹配, 所有的错误:', 错误]> : 非错误 extends [infer a, infer b, ...infer as] ? TF.错误<['找到多个匹配, 所有的匹配:', [a, b, ...as]]> : 取对象第一个键值<取数组第一个<非错误>>[1] : TF.错误<['输入不正确', A]>;
export declare type 判定实现<A> = 选择分组<分解重载<A>> extends {
    非错误: infer 非错误;
    错误: infer 错误;
} ? 非错误 extends [] ? false : 非错误 extends [infer a, infer b, ...infer as] ? false : true : TF.错误<['输入不正确', A]>;
export declare const 跳过: unique symbol;
export declare function 生成实现(实现池: any[]): (参数们: any[]) => any;
export declare function 生成实现提供者(实现池: any[]): (a: any) => number;
export {};
