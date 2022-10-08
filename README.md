# ts_polym

在 ts 上实现柯里化, 高阶类型, 可扩充的权宜多态.

## 问题

### 表达式

最开始的点子很简单: 给定一个表达式, 然后表达式代表着某种东西.

比如, `true`表示`真`, `false`表示`假`.

### 代换

光有表达式没有表现力, 于是我们发明了代换.

我们先约定一种形式: `if t then a else b`, 其中`t`, `a`, `b`是变量.

然后我们约定`if true then a else b`可以代换为`a`, `if false then a else b`可以代换为`b`.

接下来我们发明了函数, 并给函数起名字: `f = (t, a, b) => if t then a else b`.

于是我们知道`f(true, 1, 2)`是`if true then 1 else 2`也就是`1`, ` f(false, 1, 2)`是`if false then 1 else 2`也就是`2 `.

注意到这个替换可以分步进行, 可以让函数返回另一个函数, 也就是可以写成`f = (t) => (a) => (b) => if t then a else b`, 调用的时候则写成`f(true)(1)(2)`.

这称为函数的柯里化, 虽然写起来比较啰嗦, 但是更简单和通用.

### 类型

注意到上面函数 f 的参数, 第一个参数要么是 true, 要么是 false, 如果输入一个其他的东西, 就不知道要怎样运算了.

为了约束函数的参数, 我们发明了类型, 点子也很简单: `类型`是`值`的`集合`.

我们可以发明`布尔类型`, 它的一个`集合`, 它的元素只有两个: `true`和`false`.

我们也可以发明`数字类型`, 它当然也是`集合`, 它的元素是无限多的.

所以我们可以给函数参数标注类型了: `f = (t:boolean) => (a:number) => (b:number) => if t then a else b`.

### 参数多态

看起来不错, 但同时出现了问题: 如果我想写一个输入布尔值, 返回字符串的函数呢?

可以写成这样: `f2 = (t:boolean) => (a:string) => (b:string) => if t then a else b`.

但实际上`f`和`f2`的实现一模一样, 仅仅是参数的类型不同而已, 我有一万个类型, 难道要写一万个函数吗?

于是我们故技重施, 依然使用`代换`逻辑, 只是这次在类型上:

写成这样: `f = <A>(t:boolean) => (a:A) => (b:A) => if t then a else b`, 使用的时候则是`f<number>(true)(1)(2)`.

我们把类型也参数化了, 调用函数的时候需要先提供类型, 再提供值.

### 权宜多态

考虑一个`add`函数, 它的类型是: `add = <A>(a:A) => (b:A) => ...`.

如果`A`是字符串, 我应该得到字符串相加的结果, 如果`A`是数字, 我应该得到数字做加法的结果.

也就是说, 对于不同的参数, 同样的函数可以有不同的实现, 这称为权宜多态, 在面向对象的语言里称为重载.

面向对象对此的实现方案是`接口`, 不过要把它改成对象形式的, 比如这个实现:

```typescript
interface I_add<A> {
  add: (b: A) => A
}
class add_num implements I_add<number> {
  constructor(private a: number) {}
  add = (b: number) => this.a + b
}
class add_string implements I_add<string> {
  constructor(private a: string) {}
  add = (b: string) => `${this.a}${b}`
}

var a = new add_num(1).add(1)
var b = new add_string('a').add('b')
```

能不要这些东西, 直接写函数吗?

对 ts 而言, 这方面做的比较粗糙:

```typescript
function add(a: string, b: string): string
function add(a: number, b: number): number
function add(a: any, b: any) {
  if (typeof a == 'number') return a + b
  if (typeof a == 'string') return `${a}${b}`
}
```

需要在运行时进行检查倒可以理解, 因为 ts 的理念是`编译就是擦除类型`, 所以一切类型在运行时都不可见, 只能在运行时检查了.

但这样的问题是, 我无法对`add`进行扩展, 对比面向对象的实现, 我可以随时新写一个类, 让它实现`I_add`接口, 但我不能在其他地方扩充函数版本的 add 实现.

当然, 通过一些简单的奇技淫巧, 这个问题很容易绕过去.

```typescript
const 跳过: unique symbol = Symbol()

interface add {}
var add实现池: any[] = []

function 增加add实现(f: any) {
  add实现池.push(f)
}

var add: add = (a: any, b: any) => {
  for (var f of add实现池) {
    var c = f(a, b)
    if (c != 跳过) return c
  }
  throw new Error('未找到实现')
}

// 动态扩充
interface add {
  (a: number, b: number): number
}
增加add实现((a: any, b: any) => {
  if (typeof a != 'number') return 跳过
  return a + b
})

interface add {
  (a: string, b: string): string
}
增加add实现((a: any, b: any) => {
  if (typeof a != 'string') return 跳过
  return `${a}${b}`
})

var a = add(1, 2)
var b = add('a', 'b')
```

### 对泛型的限制

有时我希望更进一步, 约束泛型必须符合某种特性.

考虑一个函数: `show = <A>(a:A) => string类型的值`.

这个函数将输入的值转换为字符串, 对于数字, 字符串, 都很容易.

```typescript
interface show {
  (a: number): string
  (a: string): string
}
```

但对于数组, 有些难办, 数组的形式是`Array<A>`, 其中`A`是另一个类型.

数组`Array<A>`可以被转换为字符串的条件是, A 能被转换为字符串, 我要如何表达这一点呢?

也许可以写一个类型体操:

```typescript
interface show<A> {
  (a: Array<A>): 判断实现show<A> extends true ? string : never
}
```

不幸的是, 有一些技术细节, 我们无法获得泛型函数的所有形式, 所以`判断实现show`不能实现.

不过可以换一种写法绕过去:

```typescript
interface show<A> {
  Number: (a: number) => string
  String: (a: string) => string
  Array: (a: Array<A>) => 判断实现show<A> extends true ? string : never
}
```

这样写会是一个对象, 我们通过复杂的类型体操可以将对象的键值组成元组, 然后我们可以遍历值, 使用`&`将函数类型连起来, 即可构成重载函数.

但这样依然无法实现`判断实现show`, 考虑对其输入一个 number, 如何从已知条件中计算出 true?

可以再绕一下:

```typescript
interface show<A> {
  Number: A extends number ? string : never
  String: A extends string ? string : never
  Array: A extends Array<infer a1> ? (判断实现show<a1> extends true ? string : never) : never
}
```

现在只要给定一个类型, 然后依次检测每个值是否能推导出返回值即可, 当且仅当存在一个匹配值时, 认为输入类型实现了要求, 这样`判断实现show`就可以写出来了.

## 使用

显然, 要实现上面说的, 还有一些细节要处理.

这个库就在试图处理这些问题, 并引入了其他更完善的工具和错误提示.

请参考 test 文件来了解如何使用.
