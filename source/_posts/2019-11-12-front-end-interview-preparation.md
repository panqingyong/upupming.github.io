---
title: 前端面试准备
tags:
  - frontend
categories:
  - 前端
date: 2019-11-12 11:03:57
---

04.08 更新，已经离职，有需要内推的同学仍然可以联系我：

- upupming@gmail.com

<details>
<summary>招聘 Job Description（仅供参考）</summary>
实习生、校招、社招均可

职位描述
1. 负责今日头条付费中台产品 Web/Hybrid/Wap/小程序/Flutter 的前端开发工作；
2. 负责高质量的设计和编码；承担重点、难点的技术攻坚；
3. 负责WEB/WAP页面性能优化，打造良好的用户体验；
4. 负责推动、优化前端基础架构、组件抽象，提升开发效率。

职位要求：
1. 本科及以上学历，计算机等相关专业；
2. 对主流前端开发框架（如Vue/Angular/React等）有全面的了解，熟练使用至少一种；
3. 熟悉WEB前端技术，对符合WEB标准的网站重构、网站性能提升等有丰富经验，有成功作品；
4. 良好的设计和编码品味，热爱写代码，能产出高质量的设计和代码；较好的产品意识，愿意将产品效果做为工作最重要的驱动因素；
5. 热爱前端技术，有较强的学习能力，有强烈的求知欲、好奇心和进取心 ，能及时关注和学习业界最新的前端技术；
6. 有服务端开发(Go/Node.js)/Flutter相关开发经验者优先，熟悉TypeScript开发者优先。

总而言之，就是一些前端基础和扎实的算法基础，公司很年轻，氛围很好，实习 400/天，有一个月不重样的食堂和免费下午茶零食。
</details>

即将面试今日头条的前端实习，此次一定要做好充足准备，特打算花个几天的时间对前端来一个系统性的梳理（前端太庞大，其实也只能包含一小部分哈哈）。虽然检查了很多遍，可能仍有错误，如果发现，请指正，谢谢！

本文参考了很多资料，特别需要感谢的有：

1. https://juejin.im/post/5dafb263f265da5b9b80244d
2. https://github.com/Molunerfinn/2019-job-hunting

<!-- more -->

## JS

### ES6 (ES 2015) 新特性

参考：https://github.com/lukehoban/es6features

#### Promise

Promise 与回调函数一样用来管理 JS 中的异步编程，它的提出解决了层层回调函数嵌套造成的**回调地狱**。new Promise的时候，会把传递的函数立即执行。Promise函数天生有两个参数，resolve(当异步操作执行成功，执行resolve方法),rejected(当异步操作失败，执行reject方法) 。

通过使用 Promise 的 `.then()` 方法，可以注册回调函数，并在 Promise resolved 之后被调用，`then` 可以返回一个新的 Promise，Promise 将会 resolve 为 `then` 注册的函数中的返回值，这样实现了链式的回调函数注册。Promise 有三种可能状态，pending、fulfilled（成功）、rejected（失败）。一个 Promise 一旦 resolve 或者 reject 状态就不再改变。可以用 `.catch()` 获取 reject 的 Promise 的原因，也可以用 `.then()` 第二个参数获取。另外还有 `Promise.all`、`Promise.race` 等等。

相关代码如下（来源：https://github.com/Molunerfinn/2019-job-hunting ）：

```js
// 实现 Promise.race，resolve 或 reject 第一个即可
Promise.race = function (promises) {
  return new Promise((resolve, reject) => {
    for (const item of promises) {
      Promise.resolve(item).then(res => {
        resolve(res)
      }, err => {
        reject(err)
      })
    }
  })
}

// 实现Promise.all
Promise.all = function (promises) {
  const length = promises.length
  let count = 0
  const result = new Array(length) // 暂存结果
  return new Promise((resolve, reject) => {
    for (const item in promises) {
      Promise.resolve(promises[item]).then(res => {
        count++
        // Promise.all 输出结果顺序是按传入的promise的顺序来的
        result[item] = res
        if (count === length) { // 全部完成再 resolve
          return resolve(result)
        }
      }, err => {
        reject(err) // 一旦有 reject，就 reject
      })
    }
  })
}
```

相应的，还有 `async`、`await`。

异步编程四种方法：

- 回调函数
- 事件监听
- 发布/订阅
- Promise 对象

#### 参数默认值

```js
function print(a = 'test') {
  console.log(a)
}

print() // test
print('Hello') // Hello
```

另外还有：

- 模板字符串（可以嵌套）
- 解构赋值（数组、对象）
- 展开语法 `...`，接收剩余参数、将数组转换为逗号分隔的变量
- 块级作用域 `let`、`const`，无变量提升，不允许重复声明
- 迭代器和 `for` ... `of`
- 生成器

  ```js
  function* d() { // Generator 函数。它不同于普通函数，是可以暂停执行的，所以函数名之前要加星号，以示区别。
    for (let i = 0; i < 3; i++) {
      yield i * i
    }
  }

  for (let i of d()) { // 调用 Generator 函数，会返回一个内部指针（即迭代器/遍历器 ），即执行它不会返回结果，返回的是指针对象
    console.log(i) // 0, 1, 4
  }
  console.log(d().next()) // {value: 0, done: false}，调用指针对象的 next 方法，会移动内部指针；next 方法的作用是分阶段执行 Generator 函数
  ```

- 模块，`import`、`export`
- 模块加载器
- Map + Set + WeakMap（只接受对象键名，且是弱引用） + WeakSet
- 箭头函数，箭头函数没有 `arguments` 实参集合,取而代之用 `...` 运算符

### 变量提升

1. 所有 `var` 声明都会被提升到作用域的最顶上
2. 同一个变量声明只进行一次

    ```js
    console.log(foo) // undefined，刚刚声明完成但是并未赋值
    var foo = 3
    console.log(foo) // 3，完成赋值
    var foo = 5
    console.log(foo) // 5，再次赋值
    ```

3. 函数声明的优先级优于变量声明，且函数声明会连带定义一起被提升

    ```js
    console.log(foo) // 输出 `foo() {}`
    function foo() {}
    foo = 5
    ```

4. 注意只有 `var` 才能提升，不带 `var` 的全局变量还是按照顺序声明

    ```js
    console.log(foo) // Uncaught ReferenceError: foo is not defined
    foo = 3
    foo = 5
    ```

### 作用域

在 ES5 中，js 只有两种形式的作用域：**全局作用域**和**函数作用域**。

先来看看 `var`：

```js
(function() {
      var a = b = 5;
  })();
var c = 55
console.log(window.c) // 55，var 作用域存在于所定义的函数，否则（没有外围函数）就属于 window（浏览器）/global（Node.js）
console.log(b); // 5，b 没有关键字 var，是全局变量
console.log(window.b); // 5，全局变量也属于 window 对象
console.log(a); // undefined，离开了 a 的作用域
```

在 ES6 中，新增加的 `let/const` 让 **块级作用域（block scope）** 成为现实，在js中常见到的 `if{}`、`for{}`、`while{}`、`try{}`、`catch{}`、`switch case{}` 甚至直接单纯的 `{}` 这种带花括号的都是块级作用域，`var obj = {}` 中对象的大括号不是块级作用域。块级作用域中的同一变量不能被重复声明（块级下 `let` 不能重复定义，严格模式下 function 也不能重复声明）。

### `this` 指向

`this` 的指向和 `var` 很类似，`this` 总是指向**调用这个函数的对象**，根据 `this` 所在的函数主要分为两种情况：

1. 如果此函数是一个对象 `obj` 的成员，我们称之为**方法**（method），`this` 指向方法所属对象 `obj`。

    ```js
    const video = {
        title: 'a',
        play() {
            console.log(this)
        }
    }

    video.play() // Object {title: "a", play: function play()}
    video.stop = function() {
        console.log(this)
    }
    video.stop() // Object {title: "a", play: function play()}
    ```

2. 如果此函数是一个普通函数，即不是某个对象的一部分，`this` 指向 window（浏览器）/global（Node.js），如果是严格模式则是 `undefined`。

    ```js
    function playVideo() {
        console.log(this)
    }
    playVideo() // Window
    ```

3. 构造函数同 1 类似，`this` 指向新创建的对象。

    ```js
    function Video(title) {
        this.title = title
        console.log(this)
    }
    const v = new Video('b') // Video {title: "b"}
    ```

4. 回调函数，`this` 指向 window（浏览器）/global（Node.js）。

    ```js
    function Video(title) {
        this.title = title
        console.log(this)
        const arr = [1, 2, 3]
        arr.forEach(function(ele) {
            console.log(this) // 三次打印 Window，要使 `this` 指向新建的 Video，有两种方法：
            // 1. forEach 在 callback 参数之后可以添加 `thisArg` 参数
            // 2. 使用 ES6 中新增的箭头函数
        })
    }
    const v = new Video('b')
    ```

5. 箭头函数，`this` 指向外层函数的 `this`，并且不能用 `call` 进行指定。

    ```js
    const obj = {
        a: () => {
            console.log(this)
        }
    }
    obj.a()  // Window
    obj.a.call('123') // Window
    ```

6. 元素监听函数，指向元素本身。

    ```js
    let button = document.getElementById('button')
    button.addEventListener('click', function(e) {
        console.log(this) // <button id="button">测试 this</button>
    })
    ```

### 闭包

简单来说闭包就是在函数里面声明函数并返回，当一个函数能够访问和操作另一个函数作用域中的变量时，就构成了一个闭包（Closure）。我们要记住函数在执行时使用的是**声明**时所处的作用域链，而不是调用时的作用域链。

```js
function addTo(base) {
  let sum = base
  return function(b) {
    sum += b
    return sum
  }
}

let add = addTo(2)
console.log(add(4)) // 6
console.log(add(5)) // 11
```

- 优点：避免全局变量的污染，设置私有变量，回调函数（定时器、DOM 事件监听器、Ajax 请求等等）。
- 缺点：闭包常驻内存，容易造成内存泄漏。

### 同源策略和跨域方法

同源策略指的是**协议**、**域名**、**端口**相同，一段脚本只能读取来自同源的信息。注意子域名也不同源。

同源策略限制是有道理的，假设没有同源策略，黑客可以利用 IFrame 把真正的银行登陆界面嵌入到他的页面上，当你使用真实用户名、密码登录时，他的页面就可以通过 JS 读取到 Iframe 中 input 中的内容、你使用的 Cookie 等，能够轻松盗取用户信息。

跨域主要有以下几种方法：

- jsonp 跨域。`<script>` 的 `src` 属性（类似的还有 `href` 属性）不受同源策略限制，我们在 js 中定义回调函数 `callback(data)` 接收服务器传来的 `data`，请求时必须指定回调函数名称，服务器动态生成 js 脚本对本地的 js `callback` 进行调用并传入服务端查询得到的 `data` 数据。注意 jsonp 只能解决 GET 请求。
- `document.domain = ...`。脚本可以将 document.domain 的值设置为其**当前域**或其**当前域的父域**。注意，company.com 不能设置 document.domain 为 othercompany.com，因为它不是 company.com 的父域。
- 服务器代理。内部服务器代理请求跨域 url，然后返回数据。
- CORS 跨源资源分享（Cross-Origin Resource Sharing）。跨域请求数据，现代浏览器可使用 HTML5 规范的 CORS 功能，只要目标服务器返回的 HTTP 头部有 `Access-Control-Allow-Origin: *` 即可像普通 ajax 一样访问跨域资源。注意如请求方法是PUT或DELETE，或者Content-Type字段的类型是application/json，称为非简单请求，在正式通信之前，还需要增加一次预检请求（preflight）。用到的头部有 `Access-Control-Request-Method`、`Access-Control-Request-Headers`、`Access-Control-Allow-Methods`、`Access-Control-Allow-Headers`、`Access-Control-Allow-Credentials`（发送Cookie和HTTP认证信息）。
- `window.postMessage()`。现代浏览器中多窗口通信使用 HTML5 规范的 targetWindow.postMessage(data, origin);其中 data 是需要发送的对象，origin 是目标窗口的 origin。window.addEventListener('message', handler, false);handler 的 event.data 是 postMessage 发送来的数据，event.origin 是发送窗口的 origin，event.source 是发送消息的窗口引用。

### localStorage vs. Cookie vs. sessionStorage

参考：https://juejin.im/post/5dafb263f265da5b9b80244d#heading-29

- 相同点：保存在浏览器，同源。
- 不同点

    1. Cookie 始终在同源的 http 请求中携带，即 Cookie 在浏览器和服务器间来回传递；
    2. `window.sessionStorage` 和 `window.localStorage` 不会自动把数据发给服务器，仅在本地保存；
    3. Cookie 数据还有路径（path）的概念，可以限制 Cookie 只属于某个路径下；
    4. 存储大小限制也不同，Cookie 数据不能超过 4k，同时因为每次 http 请求都会携带 Cookie，所以 Cookie 只适合保存很小的数据；
    5. sessionStorage 和 localStorage 虽然也有存储大小的限制，但比 Cookie 大得多，可以达到 5M 或更大；
    6. 数据有效期不同，sessionStorage 仅在当前浏览器窗口关闭前有效，自然也就不可能持久保持；
    7. localStorage 始终有效，窗口或浏览器关闭也一直保存，因此用作持久数据；
    8. Cookie 只在设置的 Cookie 过期时间之前一直有效，即使窗口或浏览器关闭；
    9. 作用域不同，sessionStorage 不在不同的浏览器窗口中共享，即使是同一个页面；localStorage 在所有同源窗口中都是共享的；Cookie也是在所有同源窗口中都是共享的。

### `call` vs `apply` vs `bind`

`call` 和 `apply` 都是用来改变函数执行的时候的 `this` 和参数。唯一不同的是 `call` 传入逗号（**c**omma）分隔的参数，`apply` 传入数组（**a**rray）作为参数。

`bind` 返回一个新的函数，传入一个 `this` 参数和逗号分隔的参数，新返回的函数执行时使用给定的 `this` 和参数。

如果要自己实现这三个函数的话，核心的思路就是：

```js
Function.prototype.newCall = function (context, ...args){
    //...
    context.fn = this // 当前调用 newCall 的函数
    const
    result = context.fn(...args) // 此处调用时改变了this指向，fn的this指向context
    // ...
}
```

### JavaScript 事件流

参考：https://segmentfault.com/a/1190000005654451

事件流描述的是从页面中接收事件的顺序,也可理解为事件在页面中传播的顺序。

**事件冒泡**和**事件捕获**分别由微软和网景公司提出，在事件捕获的概念下在p元素上发生click事件的顺序应该是document -> html -> body -> div -> p，在事件冒泡的概念下在p元素上发生click事件的顺序应该是p -> div -> body -> html -> document。

addEventListener有三个参数：

```js
element.addEventListener(event, function, useCapture)
```

第三个参数默认值是false，表示在事件冒泡阶段调用事件处理函数;如果参数为true，则表示在事件捕获阶段调用处理函数。点击下面的 s2 按钮查看效果。

<p class="codepen" data-height="265" data-theme-id="light" data-default-tab="js,result" data-user="upupming" data-slug-hash="Pooaead" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="event capture and bubbling">
  <span>See the Pen <a href="https://codepen.io/upupming/pen/Pooaead">
  event capture and bubbling</a> by Li Yiming (<a href="https://codepen.io/upupming">@upupming</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

注意：对于target节点上（这里的 s2），是先捕获还是先冒泡则捕获事件和冒泡事件的注册顺序，先注册先执行）。

阻止冒泡：

```js
function stopBubble(e) {
    if (e && e.stopPropagation) { // 如果提供了事件对象event 这说明不是IE浏览器
        e.stopPropagation()
    } else {
    window.event.cancelBubble = true //IE方式阻止冒泡
}
```

#### 事件代理

<p class="codepen" data-height="265" data-theme-id="light" data-default-tab="js,result" data-user="upupming" data-slug-hash="rNNKvZe" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="事件代理">
  <span>See the Pen <a href="https://codepen.io/upupming/pen/rNNKvZe">
  事件代理</a> by Li Yiming (<a href="https://codepen.io/upupming">@upupming</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

#### IE 兼容性

IE浏览器对addEventListener兼容性并不算太好，只有IE9以上可以使用。

要兼容旧版本的IE浏览器，可以使用IE的attachEvent函数

```js
object.attachEvent(event, function)
```

两个参数与addEventListener相似，分别是事件和处理函数，默认是事件**冒泡阶段**调用处理函数，要注意的是，写事件名时候要加上"on"前缀（"onload"、"onclick"等）。

### `typeof` vs. `instanceof`

参考：https://stackoverflow.com/questions/899574/what-is-the-difference-between-typeof-and-instanceof-and-when-should-one-be-used

`typeof` 用来判断简单**原始类型**（primitive types），`instanceof` 用来判断复杂原始类型、Object、自定义数据类型。

```js
/** 简单原始类型 */
'example string' instanceof String; // false
typeof 'example string' == 'string'; // true，string 类型用 typeof

'example string' instanceof Object; // false
typeof 'example string' == 'object'; // false

true instanceof Boolean; // false
typeof true == 'boolean'; // true，boolean 类型用 typeof

99.99 instanceof Number; // false
typeof 99.99 == 'number'; // true，number 类型用 typeof

function() {} instanceof Function; // true
typeof function() {} == 'function'; // true，function 类型用 typeof、instanceof 均可

/** 复杂原始类型 */
/regularexpression/ instanceof RegExp; // true，正则表达式用 instanceof
typeof /regularexpression/; // object

[] instanceof Array; // true，array 用 instanceof
typeof []; //object

{} instanceof Object; // true，object 用 instanceof
typeof {}; // object

/** 自定义类型 */
var ClassFirst = function () {};
var ClassSecond = function () {};
var instance = new ClassFirst();
typeof instance; // object
typeof instance == 'ClassFirst'; // false
instance instanceof Object; // true
instance instanceof ClassFirst; // true
instance instanceof ClassSecond; // false
```

#### 数组判断

除了上面的 `instanceof` 外还有如下方法：

```js
// Array API
Array.isArray(arr)

// Object类型的toString会返回[object type]，其中type是类型
// 但是有的对象的toString方法会被改写
// 所以需要借用一下Object原始的toString
return Object.prototype.toString.call(arr) === '[object Array]'

// 利用自定义对象的 constructor
arr.constructor.name === 'Array'
```

#### 自己实现 `instanceof`

循环使用 `Object.getPrototypeOf()` 即可：

```js
// getPrototypeOf 可同时用于对象和原型，不能直接用于类型（直接返回 Function.prototype）
Object.getPrototypeOf([]) === Array.prototype // true
Object.getPrototypeOf(Array.prototype) === Object.prototype // true
Object.getPrototypeOf(Array) == Function.prototype // true

let newInstanceOf = function (left, right) {
    // 检查必须是复杂数据类型
    if (typeof left !== 'object' && typeof left !== 'function') {
        return false
    }
    right = right.prototype
    do {
        left = Object.getPrototypeOf(left)
        if (left === right) return true
    } while (left !== null)
    return false
}
```

也可以使用 `isPrototypeOf` 直接检查对象是否在另一对象的其原型链上：

```js
Object.prototype.isPrototypeOf([]) // true
Array.prototype.isPrototypeOf([]) // true
```

另外注意 `hasOwnProperty` 在执行对象查找时，始终不会查找原型。

### `==` vs `===`

- `==`：**允许不同数据类型**之间的比较，如果是不同类型的数据进行比较，会默认进行数据类型之间的转换，如果是对象数据类型的比较，比较的是空间地址；

    ```js
    a = [1, 2]
    b = [1, 2]
    // 比较地址空间
    a == b // false
    _.isEqual(array1, array2) // true，使用 Lodash 库进行比较，或者自己一个一个元素进行比较
    false
    ```

- `===`：只要数据类型不一样，就返回false。

### 防抖（debounce） vs. 节流（throttle）

防抖是说**连续两次**的调用必须间隔指定的时间，节流是说当调用一次之后，必须在**指定时间之后的调用**才会有效。

具体使用场景：

- 比如用户 `resize` 调整窗口大小，因为一次窗口调整中间会出发出相当多的时间间隔很短的 `resize` 事件，那么防抖主要是看用户进行调整的总次数，而节流看的是每一次调整时，用户的 `resize` 的手速有多快。
- 在搜索引擎中，时常出现比如要搜索 `front end`，当你输入前面的 `f` 或者 `front` 时就会出现候选结果。但是因为 API 调用消耗很大，所以会使用防抖来较少调用次数，这符合用户停顿时就是想看到搜索结果的现实逻辑。

实现如下：

```js
function debounce(func, limit) {
  let timer
  return function (...args) {
    // 前一次还没来得及执行的话，取消掉前一次的
    clearTimeout(timer)
    timer = setTimeout(() => {
      func.apply(this, args)
    }, limit)
  }
}

function throttle(func, limit) {
  let flag = true
  return function(...args) {
    if (flag) {
      func.apply(this, args)
      flag = false
      // 只有经过指定时间后，才可以执行新的
      setTimeout(() => {
        flag = true
      }, limit)
    }
  }
}
```

### 清除浮动

> 在非IE浏览器（如Firefox）下，当容器的高度为auto，且容器的内容中有浮动（float为left或right）的元素，在这种情况下，容器的高度不能自动伸长以适应内容的高度，使得内容溢出到容器外面而影响（甚至破坏）布局的现象。这个现象叫浮动溢出，为了防止这个现象的出现而进行的CSS处理，就叫CSS清除浮动。

- clear 清除浮动，添加空div法，在浮动元素下方添加空div,并给该元素写css样式 {clear:both;height:0;overflow:hidden;}
- 给浮动元素父级设置高度
- 父级同时浮动（需要给父级同级元素添加浮动）
- 父级设置成 `inline-block`，其 `margin: 0 auto` 居中方式失效
- 给父级添加 `overflow:hidden`
- 万能清除法 after 伪类清浮动（现在主流方法，推荐使用）

### 圣杯布局和双飞翼布局

#### 圣杯布局

<p class="codepen" data-height="265" data-theme-id="light" data-default-tab="css,result" data-user="upupming" data-slug-hash="qBBQemg" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="圣杯布局">
  <span>See the Pen <a href="https://codepen.io/upupming/pen/qBBQemg">
  圣杯布局</a> by Li Yiming (<a href="https://codepen.io/upupming">@upupming</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

#### 双飞翼布局

<p class="codepen" data-height="265" data-theme-id="light" data-default-tab="css,result" data-user="upupming" data-slug-hash="pooQMad" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="双飞翼布局">
  <span>See the Pen <a href="https://codepen.io/upupming/pen/pooQMad">
  双飞翼布局</a> by Li Yiming (<a href="https://codepen.io/upupming">@upupming</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

### Ajax

ajax的原理：相当于在用户和服务器之间加一个中间层（ajax引擎),使用户操作与服务器响应异步化。

- 优点：在不刷新整个页面的前提下与服务器通信维护数据。不会导致页面的重载可以把前端服务器的任务转嫁到客服端来处理，减轻服务器负担，节省带宽；
- 劣势：不支持返回上一次请求内容。对搜索引擎的支持比较弱（百度在国内搜索引擎的占有率最高，但是很不幸，它并不支持ajax数据的爬取）；不容易调试。

怎么解决呢？通过`location.hash`值来解决Ajax过程中导致的浏览器前进后退按键失效，
解决以前被人常遇到的重复加载的问题。主要比较前后的hash值，看其是否相等，在判断是否触发ajax。

```js
function getData(url) {
    var xhr = new XMLHttpRequest();  // 创建一个对象，创建一个异步调用的对象
    xhr.open('get', url, true)  // 设置一个http请求，设置请求的方式，url以及验证身份
    xhr.send() //发送一个http请求
    xhr.onreadystatechange = function () {  //设置一个http请求状态的函数
        if (xhr.readyState == 4 && xhr.status ==200) {
            console.log(xhr.responseText)  // 获取异步调用返回的数据
        }
    }
}
```

AJAX状态码：

- 0 - （未初始化）还没有调用send()方法
- 1 - （载入）已调用send方法，正在发送请求
- 2 - （载入完成）send()方法执行完成
- 3 - （交互）正在解析相应内容
- 4 - （完成）响应内容解析完成，可以在客户端调用了

### 用 `setTimeout` 实现 `setInterval`

基本思想：

```js
function mySetInterval(handler, timeout, ...arguments) {
  const fn = () => { // 关键在于构造 fn 反复调用 handler
    handler()
    setTimeout(fn, timeout)
  }
  setTimeout(fn, timeout)
}
mySetInterval(() => {
  console.log(`bla bla...`)
}, 1000)
```

另外，还可以实现 `clearTimeInterval`（利用全局 `obj` 存储自增的 `id` 到 `timeId` 的映射） 和 `arguments` 自定义参数。

### 事件循环

JavaScript 的并发模型基于“事件循环”。这个模型与像 C 或者 Java 这种其它语言中的模型截然不同。

一个 JavaScript 运行时包含了一个待处理的消息队列。每一个消息都关联着一个用以处理这个消息的函数。

在事件循环期间的某个时刻，运行时从最先进入队列的消息开始处理队列中的消息。为此，这个消息会被移出队列，并作为输入参数调用与之关联的函数。调用一个函数总是会为其创造一个新的栈帧。函数的处理会一直进行到执行栈再次为空为止；然后事件循环将会处理队列中的下一个消息（如果还有的话）。

Event Loop是一个程序结构，用于等待和发送消息和事件。常见形式：

```js
while (queue.waitForMessage()) {
  queue.processNextMessage();
}
```

```js
const s = new Date().getSeconds();

setTimeout(function() {
  // 输出 "2"，表示回调函数并没有在 500 毫秒之后立即执行
  // 而是等待下面的 while 执行完之后才开始执行
  // 在浏览器里，当一个事件发生且有一个事件监听器绑定在该事件上时，消息会被随时添加进队列。
  // 500ms过后,WebAPIs把此函数放入任务队列,此时while循环还在栈中,此函数需要等待;
  console.log("Ran after " + (new Date().getSeconds() - s) + " seconds");
}, 500);

while(true) {
  // while循环执行完毕从栈中弹出,main()弹出,此时栈为空,Event Loop,setTimeout中的回调函数进入栈
  if(new Date().getSeconds() - s >= 2) {
    console.log("Good, looped for 2 seconds");
    break;
  }
}
```

### `class` & `interface`

在es6中，我们有一种新的关键字`class`来定义一个类；我们可以继承方法和属性，使用`extends`关键字继承；其实本质上，还是使用原型链的方式继承，只是给了更好理解的语法糖；Typescript在 `class` 的基础上添加了访问修饰符和接口 `interface` 。

<!--
### 图片下载

已有 API:

```js
// 给定图片地址，下载图片并返回 Data
fetch(imgUrl: string) : Promise<Data>
```

现在假设浏览器的图片下载队列最多可以容纳 6 张同时下载，要求写一个函数，下载一组图片，之后返回这一组图片的数据。

```js
``` -->

## HTML

### Property 和 Attribute 的区别

property：属性，attribute：特性

attribute 是 DOM 元素在文档中作为 HTML 标签拥有的属性；property 是 DOM 元素在 JavaScript 中作为对象拥有的属性。

#### 创建

- DOM对象初始化时会在创建默认的基本property；`input.value`、`input.id`、`input.disabled`、`a1.href` 等等
- 只有在HTML标签中定义的attribute才会被保存在元素的 `attributes` 属性中，常用方法：`getAttribute`、`setAttribute`、`removeAttribute`；
- attribute会初始化property中的同名属性，但自定义的attribute不会出现在property中；
- attribute的值都是字符串；

#### 数据绑定

- attributes的数据会同步到property上，然而property的更改不会改变attribute；
- 对于 `value`，`class` 这样的属性/特性，数据绑定的方向是单向的，attribute->property；
- 对于 `id` 而言，数据绑定是双向的，attribute<=>property；
- 对于 `disabled` 而言，property上的disabled设置为false时，会移除attribute上的 `disabled`，反之亦然，此时数据绑定可以认为是双向的；

## CSS

### 置换元素

置换元素（replaced element）主要是指 img, input, textarea, select, object 等这类默认就有 CSS 格式化外表范围的元素。进而可知，非置换元素（non-replaced element）就是除了 img, input, textarea, select, object 等置换元素以外的元素。

> 在 CSS 中，可替换元素（replaced element）的展现效果不是由 CSS 来控制的。这些元素是一种外部对象，它们外观的渲染，是独立于 CSS 的。

### 背景属性

background-color 规定要使用的背景颜色。
background-position 规定背景图像的位置。
background-size 规定背景图片的尺寸。
background-repeat 规定如何重复背景图像。
background-origin 规定背景图片的定位区域。
background-clip 规定背景的绘制区域。
background-attachment 规定背景图像是否固定或者随着页面的其余部分滚动。
background-image 规定要使用的背景图像。
inherit 规定应该从父元素继承 background 属性的设置。

### 盒模型

#### W3C盒模型

`box-sizing: content-box`（默认）

总宽度 = margin-left + border-left + padding-left + width + padding-right + border-right + margin-right

如果你设置一个元素的宽为 100px，那么这个元素的内容区会有 100px 宽，并且任何边框和内边距的宽度都会被增加到最后绘制出来的元素宽度中。

#### IE盒模型

`box-sizing: border-box`

总宽度 = margin-left + width + margin-right

你想要设置的边框和内边距的值是包含在width内的。也就是说，如果你将一个元素的width设为100px，那么这100px会包含它的border和padding，内容区的实际宽度是width减去(border + padding)的值。大多数情况下，这使得我们更容易地设定一个元素的宽高。

#### 支持情况

参考：https://juejin.im/post/59ef72f5f265da4320026f76

在ie8+浏览器中使用哪个盒模型可以由box-sizing(CSS新增的属性)控制，默认值为content-box，即标准盒模型；如果将box-sizing设为border-box则用的是IE盒模型。如果在ie6,7,8中DOCTYPE缺失会触发IE模式。在当前W3C标准中盒模型是可以通过box-sizing自由的进行切换的。

#### 纯 CSS 画三角形

利用标准盒模型即可：

<p class="codepen" data-height="265" data-theme-id="light" data-default-tab="css,result" data-user="upupming" data-slug-hash="VwwdxXr" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="VwwdxXr">
  <span>See the Pen <a href="https://codepen.io/upupming/pen/VwwdxXr">
  VwwdxXr</a> by Li Yiming (<a href="https://codepen.io/upupming">@upupming</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

### 选择器

参考：https://www.w3schools.com/cssref/trysel.asp

### `static`、`relative`、`absolute`、`fixed`

参考：https://www.cnblogs.com/theWayToAce/p/5264436.html

1. `static`（静态定位）：默认值。没有定位，元素出现在正常的流中（忽略 top, bottom, left, right 或者 z-index 声明）。
2. `relative`（相对定位）：生成相对定位的元素，通过top,bottom,left,right的设置相对于其正常（原先本身）位置进行定位。可通过z-index进行层次分级。　　

    - 定位为relative的元素脱离正常的文本流中，但其在文本流中的位置依然存在。
    - 无论父级存在不存在，无论有没有TRBL，均是以父级的左上角进行定位，但是父级的Padding属性会对其影响。
    - relative定位的层总是相对于其最近的父元素，无论其父元素是何种定位方式。

3. `absolute`（绝对定位）：生成绝对定位的元素，相对于 static 定位以外的第一个父元素进行定位。元素的位置通过 "left", "top", "right" 以及 "bottom" 属性进行规定。可通过z-index进行层次分级。

    - 定位为absolute的层脱离正常文本流，但与relative的区别是其在正常流中的位置不再存在。
    - 即使父级有Padding属性，对其也不起作用，说简单点就是：它只坚持一点，就以父级左上角为原点进行定位，父级的padding对其根 本没有影响。
    - 对于absolute定位的层总是相对于其最近的定义为absolute或relative的父层。如果其父层中都未定义absolute或relative，则其将相对body进行定位。

4. `fixed`（固定定位）：生成绝对定位的元素，相对于浏览器窗口进行定位。元素的位置通过 "left", "top", "right" 以及 "bottom" 属性进行规定。可通过z-index进行层次分级。

定位于父级内部某个位置的元素，最好用 absolute，因为它不受父级元素的padding的属性影响，当然你也可以用relative，不过到时候计算的时候不要忘记padding的值。

### `inline` vs. `inline-block` vs. `block`

参考：https://21cm.js.org/2018/05/24/css%20inline&&inline-block&&block/

block和inline这两个概念是简略的说法，完整确切的说应该是 block-level elements (块级元素) 和 inline elements (内联元素)。

block元素通常被现实为独立的一块，会单独换一行；inline元素则前后不会产生换行，一系列inline元素都在一行内显示，直到该行排满。

大体来说HTML元素各有其自身的布局级别（block元素还是inline元素）：

- 常见的块级元素有 DIV, FORM, TABLE, P, PRE, H1~H6, DL, OL, UL 等。
- 常见的内联元素有 SPAN, A, STRONG, EM, LABEL, INPUT, SELECT, TEXTAREA, IMG, BR 等。

block元素可以包含block元素和inline元素；但inline元素只能包含inline元素。要注意的是这个是个大概的说法，每个特定的元素能包含的元素也是特定的，所以具体到个别元素上，这条规律是不适用的。比如 P 元素，只能包含inline元素，而不能包含block元素。

细节对比：

- display:block

    block元素会独占一行，多个block元素会各自新起一行。默认情况下，block元素宽度自动填满其父元素宽度。
    block元素可以设置width,height属性，即使设置了宽度,仍然是独占一行。
    block元素可以设置margin和padding属性。

- display:inline

    inline元素不会独占一行，多个相邻的行内元素会**排列在同一行**里，直到一行**排列不下，才会新换一行**，其宽度随元素的内容而变化。
    inline元素设置width,height属性无效。
    inline元素的margin和padding属性，水平方向的padding-left, padding-right, margin-left, margin-right都产生边距效果；
    但竖直方向的padding-top, padding-bottom, margin-top, margin-bottom不会产生边距效果。

- display:inline-block

    简单来说就是将对象呈现为inline对象，但是**对象的内容作为block对象**呈现。之后的内联对象会被排列在同一行内。
    比如我们可以给一个link（a元素）inline-block属性值，使其既具有block的宽度高度特性又具有inline的同行特性。

### 居中

参考：https://juejin.im/post/5a7a9a545188257a892998ef

#### 水平居中

1. `margin: auto`：适用于块级元素

    <p class="codepen" data-height="265" data-theme-id="light" data-default-tab="css,result" data-user="upupming" data-slug-hash="KKKBRRE" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="KKKBRRE">
      <span>See the Pen <a href="https://codepen.io/upupming/pen/KKKBRRE">
      KKKBRRE</a> by Li Yiming (<a href="https://codepen.io/upupming">@upupming</a>)
      on <a href="https://codepen.io">CodePen</a>.</span>
    </p>
    <script async src="https://static.codepen.io/assets/embed/ei.js"></script>

2. `text-align: center`：适用于内联元素

    <p class="codepen" data-height="265" data-theme-id="light" data-default-tab="css,result" data-user="upupming" data-slug-hash="XWWBqwd" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="XWWBqwd">
      <span>See the Pen <a href="https://codepen.io/upupming/pen/XWWBqwd">
      XWWBqwd</a> by Li Yiming (<a href="https://codepen.io/upupming">@upupming</a>)
      on <a href="https://codepen.io">CodePen</a>.</span>
    </p>
    <script async src="https://static.codepen.io/assets/embed/ei.js"></script>

#### 垂直居中

1. `line-height: height`：适用于内联元素

    The `line-height` CSS property sets the height of a line box. It's commonly used to set the distance between lines of text. On block-level elements, it specifies **the minimum height of line boxes** within the element. On non-replaced inline elements, it specifies **the height that is used to calculate line box height**.

    `line-height` CSS 属性用于设置多行元素的空间量，如多行文本的间距。对于块级元素，它指定元素行盒（line boxes）的最小高度。**对于非替代的 inline 元素，它用于计算行盒（line box）的高度**。（也就是说内联元素的高度就是在父元素中指定的 `line-height` 了。）

    <p class="codepen" data-height="265" data-theme-id="light" data-default-tab="css,result" data-user="upupming" data-slug-hash="gOOjzVj" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="gOOjzVj">
      <span>See the Pen <a href="https://codepen.io/upupming/pen/gOOjzVj">
      gOOjzVj</a> by Li Yiming (<a href="https://codepen.io/upupming">@upupming</a>)
      on <a href="https://codepen.io">CodePen</a>.</span>
    </p>
    <script async src="https://static.codepen.io/assets/embed/ei.js"></script>

2. 绝对定位负 `margin`：适用于块级元素

    父元素：relative；子元素：absolute，margin-top: -(高度的一半); margin-left: -(宽度的一半);

    <p class="codepen" data-height="265" data-theme-id="light" data-default-tab="css,result" data-user="upupming" data-slug-hash="abbjKyy" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="abbjKyy">
      <span>See the Pen <a href="https://codepen.io/upupming/pen/abbjKyy">
      abbjKyy</a> by Li Yiming (<a href="https://codepen.io/upupming">@upupming</a>)
      on <a href="https://codepen.io">CodePen</a>.</span>
    </p>
    <script async src="https://static.codepen.io/assets/embed/ei.js"></script>

3. 绝对定位 + `transform`：适用于块级元素

    <p class="codepen" data-height="265" data-theme-id="light" data-default-tab="css,result" data-user="upupming" data-slug-hash="MWWBXEe" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="neg-margin">
      <span>See the Pen <a href="https://codepen.io/upupming/pen/MWWBXEe">
      neg-margin</a> by Li Yiming (<a href="https://codepen.io/upupming">@upupming</a>)
      on <a href="https://codepen.io">CodePen</a>.</span>
    </p>
    <script async src="https://static.codepen.io/assets/embed/ei.js"></script>

4. 绝对定位 + `margin: auto`：适用于块级元素

    <p class="codepen" data-height="265" data-theme-id="light" data-default-tab="css,result" data-user="upupming" data-slug-hash="BaaPVmg" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="neg-transform">
      <span>See the Pen <a href="https://codepen.io/upupming/pen/BaaPVmg">
      neg-transform</a> by Li Yiming (<a href="https://codepen.io/upupming">@upupming</a>)
      on <a href="https://codepen.io">CodePen</a>.</span>
    </p>
    <script async src="https://static.codepen.io/assets/embed/ei.js"></script>

另外还有：

- 使用 `flex` 弹性盒子布局：块级元素（兼容性不好）

    ```css
    .parent {
      width: 600px;
      height: 200px;
      border: 1px solid red;
      display: flex;
      align-items: center; /*垂直居中*/
      justify-content: center;  /*水平居中*/
    }
    ```

- `padding` child 是 parent 的一半：块级元素
- `display: table-cell`
- 伪元素

### 伪元素

`::before` 和 `::after`

垂直居中：

```css
.parent {
    width: 300px;
    height: 300px;
    border: 1px solid red;
    text-align: center;
}
.child {
    background: blue;
    width: 100px;
    height: 40px;
    display: inline-block;
    vertical-align: middle;
}
.parent::before {
    content: '';
    height: 100%;
    display: inline-block;
    vertical-align: middle;
}
```

### CSS 优先级

- 不同级别：!important > 行内样式>ID选择器 > 类选择器 > 标签 > 通配符 > 继承 > 浏览器默认属性
- **同一级别：后写的会覆盖先写的**

### visibility: hidden vs display: none

链接：https://www.nowcoder.com/questionTerminal/dce13fd5b59c41be80a22b38c5a32dc1
来源：牛客网

1. display：none会让元素从渲染树中消失，渲染的时候不占据任何空间；visibility：hidden不会让元素从渲染树中消失，渲染的时候仍然占据空间，只是内容不可见。
2. display：none是非继承属性，子孙节点消失是由于元素从渲染树中消失造成，通过修改子孙节点的属性无法显示；visibility：hidden是继承属性，子孙节点消失是由于继承了hidden，通过设置visibility：visible，可以让子孙节点显示。
3. 读屏器不会读取display：none的元素内容，而会读取visibility：hidden的元素内容。

### CSS data

```html
<article
  id="electriccars"
  data-columns="3"
  data-index-number="12314"
  data-parent="cars">
...
</article>
```

JS 访问利用 `.dataset`：

```js
var article = document.querySelector('#electriccars');

article.dataset.columns // "3"
article.dataset.indexNumber // "12314"
article.dataset.parent // "cars"
```

CSS 访问利用 `attr()`：

```css
article::before {
  content: attr(data-parent);
}
/* 属性选择器使用 data */
article[data-columns='3'] {
  width: 400px;
}
article[data-columns='4'] {
  width: 600px;
}
```

## Vue

### 生命周期

- `beforeCreate`：vue 实例的挂载元素 `el` 和数据对象 `data` 都是 `undefined`，还没有初始化。【None】
- `created`：vue 实例的数据对象 `data` 有了，可以访问数据和方法，未挂载到 DOM，`el` 还没有。【`data`】
- `beforeMount`：vue 实例的 `el` 和 `data` 都初始化了，但是挂载之前为虚拟的 DOM 结点。【`data` & `el`】
- `mounted`：vue 实例挂载到真正的 DOM 上，可以通过 DOM 获取 DOM 结点。【`data` & `el` & DOM】
- `beforeUpdate`：响应式数据更新时调用，发生在虚拟 DOM 打补丁之前，适合在更新之前访问现有的 DOM，比如手动移除已添加的事件监听器。【`data` & `el` & 旧 DOM】
- `updated`：虚拟DOM重新渲染和打补丁之后调用，组成新的DOM已经更新，避免在这个钩子函数中操作数据，防止死循环。【【`data` & `el` & 新 DOM】】
- `beforeDestroy`：实例销毁前调用，实例还可以用，this能获取到实例，常用于销毁定时器，解绑事件。
- `destroyed`：实例销毁后调用，调用后所有事件监听器会被移除，所有的子实例都会被销毁。

<!-- ## TypeScript

## Koa -->

## 杂项

### 从输入url地址到页面相应都发生了什么

1. 浏览器的地址栏输入URL并按下回车。
2. 浏览器查找当前URL是否存在缓存，并比较缓存是否过期。
3. DNS解析URL对应的IP。
4. 根据IP建立TCP连接（三次握手）。
5. HTTP发起请求。
6. 服务器处理请求，浏览器接收HTTP响应。
7. 渲染页面，构建DOM树。
8. 关闭TCP连接（四次挥手）

## 参考资料

1. [DOM 中 Property 和 Attribute 的区别](https://www.cnblogs.com/elcarim5efil/p/4698980.html)
2. [JavaScript this Keyword | YouTube](https://www.youtube.com/watch?v=gvicrj31JOM)
3. [this | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)
