import { ts转λ, λ, λ转ts, 取参数1, 取参数2, 取构造子, 调用 } from '@lsby/ts_lambda_type'
import { 检查, 等于, 错误 } from '@lsby/ts_type_fun'
import { 判定实现, 生成实现, 生成实现提供者, 计算返回类型, 跳过 } from './index'

interface Show<A> {
  Number: 检查<[A extends number ? true : 错误<['期待', A, '是', 'number']>], string>
  String: 检查<[A extends string ? true : 错误<['期待', A, '是', 'string']>], string>
  Array: 检查<
    [
      取构造子<A> extends λ<'Array'> ? true : 错误<['期待', A, '是', 'Array']>,
      取参数1<A> extends infer a1
        ? 判定实现<Show<a1>> extends true
          ? true
          : 错误<['期待', a1, '实现', 'Show']>
        : 错误<['解构失败', A]>,
    ],
    string
  >
}
var show实现池: any[] = []
var 提供show实现 = 生成实现提供者(show实现池)
var show: <A>(a: A) => 计算返回类型<Show<A>> = (a) => 生成实现(show实现池)([a])

提供show实现((a: any) => {
  if (typeof a != 'number') return 跳过
  return a.toString()
})
提供show实现((a: any) => {
  if (typeof a != 'string') return 跳过
  return a.toString()
})
提供show实现((a: any) => {
  if (!Array.isArray(a)) return 跳过
  return `[ ${a.map((a) => (show as any)(a)).join(', ')} ]`
})

var x1 = show(1)
console.log(x1 == '1')
var x2 = show('a')
console.log(x2 == 'a')
var x3 = show([1, 2, 3])
console.log(x3 == '[ 1, 2, 3 ]')

// =======================
interface Map<A_B, FA, F = 取构造子<FA>, A1 = 取参数1<A_B>, A2 = 取参数1<FA>, B = 取参数2<A_B>> {
  Array: 检查<
    [
      F extends λ<'Array'> ? true : 错误<['期待', F, '是', 'Array']>,
      等于<A1, A2> extends true ? true : 错误<[A1, '和', A2, '不相等']>,
    ],
    λ转ts<调用<F, ts转λ<B>>>
  >
}
var map实现池: any[] = []
var 提供map实现 = 生成实现提供者(map实现池)
var map: <A_B>(f: A_B) => <FA>(a: FA) => 计算返回类型<Map<A_B, FA>> = (f) => (a) => 生成实现(map实现池)([f, a])

提供map实现((f: any) => (x: any) => {
  if (!Array.isArray(x)) return 跳过
  return x.map(f)
})

var x4 = map((a: number) => a + 1)([1, 2, 3])
console.log(JSON.stringify(x4) == JSON.stringify([2, 3, 4]))

// =======================
interface Pure<A, T> {
  Array: 检查<[T extends 'Array' ? true : 错误<['期待', T, '是', 'Array']>], Array<A>>
}
var pure实现池: any[] = []
var 提供pure实现 = 生成实现提供者(pure实现池)
var pure: <T>(t: T) => <A>(f: A) => 计算返回类型<Pure<A, T>> = (a) => 生成实现(pure实现池)([a])
var Array_Type = 'Array' as 'Array'

提供pure实现((t: any) => (a: any) => {
  if (t != 'Array') return 跳过
  return [a]
})

var x5 = pure(Array_Type)(1)
console.log(JSON.stringify(x5) == JSON.stringify([1]))
