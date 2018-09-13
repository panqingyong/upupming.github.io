---
title: 小程序开发经验总结
tags:
  - HITMers
categories:
  - 项目
  - 微信小程序
date: 2018-09-12 03:15:18
---

本文主要介绍了小程序客户端、服务器端开发（RESTful API）的相关经验。

<!-- more -->

<figure class="not-code">
<img src="first-commit.png">
<caption>HITMers 第一个 commit</caption>
</figure>

经过近两个月的学习和开发，目前为哈工大博物馆开发的小程序 HITMers 已经进入测试阶段，马上就要发布正式版啦！在此特意总结一下相关的经验，也希望可以帮助到更多的人！

# 客户端: [HITmers](https://github.com/upupming/HITMers)

客户端算是比较简单的一部分，主要就是 UI 设计和逻辑交互两大块。

## 使用 UI 库 

在 UI 这块刚开始只是使用官方的一些组件，但后来发现大部分组件使用起来需要设置比较多的 CSS 属性，支持的操作也比较少。后来了解到了一些使用[自定义组件](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/)功能开发出的 UI 库：

1. [WeUI](https://github.com/Tencent/weui-wxss)

  由微信官方设计团队开发，缺点是很久没有更新，到现在为止的重要 commit 停留在 2017 年 6 月前后，所以不打算使用。

2. [赞 UI](https://github.com/youzan/zanui-weapp)

  由有赞维护，非常活跃，不断在增加新的组件。因此我考虑选用赞 UI 的这些组件为基础进行开发。

3. [Vant UI](https://github.com/youzan/vant-weapp)

  在我开发到一半的时候，有赞将赞 UI 改名 Vant UI，新的 Vant UI 看起来比原来的赞 UI 确实要好许多，不过目前有一些组件还没有，比如 `dot` 类型的 loading 组件、dialog 组件等。

组件的使用非常简单，建议直接将 Vant UI 的源代码克隆到本地，然后在开发者工具里面运行起来或者直接用手机微信搜索『Vant 组件库演示』运行，看到合适的组件就可以在 `example/pages` 文件夹下对应组件的目录里面看一下使用方法。

比如经常用到的 `cell` 组件，展示箭头的示例代码如下（使用时一定不要忘了在 `json` 文件中引入相应组件）：

```html
<demo-block title="展示箭头">
  <van-cell-group>
    <van-cell title="单元格" is-link />
    <van-cell title="单元格" is-link value="内容" />
    <van-cell
      title="单元格"
      is-link
      arrow-direction="down"
      value="内容"
      border="{{ false }}"
      url="/pages/dashboard/index"
    />
  </van-cell-group>
</demo-block>
```

可以看到，只需要简单的设置一个 `is-link` 属性就能展示箭头，这非常简洁。如果需要了解全部属性的话，可以查阅[官方文档](https://youzan.github.io/vant-weapp)。

后续如不作说明均使用 `zan-ui` 和 `van-ui` 代表着两个组件库。

## 封装 Toast、Notify 

使用 van-ui 的 Toast 和 Notify 都比较简单，首先需要在 `json` 中引入组件，然后在 `wxml` 中添加一个 `<van-toast id="van-toast"></van-toast>` 或 `<van-notify id="van-notify"></van-notify>` 元素，后续在 `js` 中展示 Toast 或 Notify：

```js
import Toast from '../van-ui/toast/index';
Toast('toast message');

import Notify from '../van-ui/notify/index';
Notify('notify message);
```

为了更高效地展示 Toast 和 Notify，封装一个 `util.js`：

```js
import Toast from '../van-ui/toast/index';

function show(message, type) {
  if(type) {
    Toast[type](message);
  } else {
    Toast(message);
  }
}

//...

module.exports = { 
  show
  //...
};
```

可以在页面 `js` 里面调用封装好的辅助函数：

```js
const util = require('../../utils/util');
util.show('Failed: ...', 'fail');
```

## Promise 异步请求 & 请求错误处理

小程序提供的异步 API 都是采用回调的形式处理结果的，这有一个很大的缺点就是代码不够整洁，层层嵌套的代码将变得非常糟糕，感兴趣的同学可以看一下 [Pyramid of doom](https://javascript.info/callbacks#pyramid-of-doom)。

[wxPromise](https://github.com/youngjuning/wxPromise) 实现了所有回调转换为 [Promise](https://javascript.info/promise-basics)。其核心思想非常简单：返回一个新的 Promise，在回调 success 时 resolve，fail 时 reject：

```js
// 把普通函数变成promise函数
const promisify = (api) => {
  return (options, ...params) => {
    return new Promise((resolve, reject) => {
      api(Object.assign({}, options, {
        success: resolve,
        fail: reject
      }), ...params)
      Promise.prototype.finally = function (callback) {
        let P = this.constructor
        return this.then(
          value  => P.resolve(callback()).then(() => value),
          reason => P.resolve(callback()).then(() => { throw reason })
        )
      }
    })
  }
}

const wxPromise = () => {
  for (let key in wx) {
    if (wx.hasOwnProperty(key)) {
      if (/^on|^create|Sync$|Manager$|^pause/.test(key) && key !== 'createBLEConnection' || key === 'stopRecord' || key === 'stopVoice' || key === 'stopBackgroundAudio' || key === 'stopPullDownRefresh' || key === 'hideKeyboard' || key === 'hideToast' || key === 'hideLoading' || key === 'showNavigationBarLoading' || key === 'hideNavigationBarLoading' || key === 'canIUse' || key === 'navigateBack' || key === 'closeSocket' || key === 'closeSocket' || key === 'pageScrollTo' || key === 'drawCanvas') {
        wx.pro[key] = wx[key]
      } else {
        // 遍历所有回调 API，将其异步化并放到 wx.pro 之下
        wx.pro[key] = promisify(wx[key])
      }
    }
  }
}
wxPromise();
```

除了使用 `wx.pro` 简化代码结构，我还发现每次 `wx.pro.request` 之后都要调用 `.catch` 来检查是否出现错误来通知用户，请求没有错误的时候也要校验是否出现错误状态码 `4xx`，重复地书写这写代码非常没有必要，因此将其封装进 `requests.js` 中：

```js
// 错误处理函数
function errorHandler(err) {
  console.error(err);
  Toast.clear();
  Notify(globalData.language.requestError + ': ' + JSON.stringify(err.errMsg));
}

// 状态码校验函数
function statusCodeChecker(res) {
  console.log(res);
  Toast.clear();
  if(res.statusCode === 200) {
    // Notify({
    //   text: globalData.language.requestSuccess,
    //   backgroundColor: '#38f'
    // });
  } else {
    Notify({
      text: globalData.language.requestError + ': ' + res.statusCode + ' ' + globalData.language[res.statusCode] + ' ' + JSON.stringify(res.data)
    });
    // Throw error with message from the server
    throw Error(res.data);
  }
  return res;
}

module.exports = {
  getUserInfo(id) {
    return request({
      url: service.user + '/' + id,
      method: 'GET',
      header: {
        'x-access-token': globalData.token
      }
      // 在这里复用这些函数
    }).catch(errorHandler)
      .then(statusCodeChecker);
  }
}
```

## 国际化

小程序国际化已经在 [微信小程序语言切换](../../../../2018/07/23/mini-program-i18n/) 中有过介绍了。

另外，相信读者在看到上一部分请求的封装时已经看到了 `globalData.language` 而不是 `wx.T.getLanguage()`，这是一种更加简洁的方式。我们在每次修改语言时都更新一下 `globalData.language`，调用 `requests.js` 时也会相应跟着改变。原来的 `event.on('languageChanged', this, this.setLanguage);` 还是需要保留的，这是为了每次修改语言时调用未 onShow 的页面的 `setData ` 修改其页面数据。

**关于 `globalData`：**

小程序中的 `globalData` 在任何页面都可以修改，在其他页面访问时也会实时更新，建议将一些全局信息存到 `globalData` 中方便使用，还可以将 `globalData` 存储到用户缓存，下次加载时恢复。

`globalData` 时常更新，如果要使用 `globalData` 中的值进行数据绑定，最好在页面 onLoad 或 onShow 时 `setData` 而不是单纯地将 `data` 里的数据委托到 `globalData` 上。

## 请求域名设置

在开发模式下，使用本地运行的 Node.js 监听地址作为 request 域名，在生产模式则使用真实的域名。

```js
let host;
let env = 'dev';

if(env === 'production') {
  host = 'https://hitmers-api.solotime.xyz';
} else {
  // dev 环境下在电脑上使用 iphone 5；手机端则是安卓，只能使用真实域名
  host = wx.getSystemInfoSync().model === 'iPhone 5' ? 'http://localhost:5757': 'https://hitmers-api.solotime.xyz';
}
```

# 服务端：[HITMers-node-js-server](https://github.com/upupming/HITMers-node-js-server)

刚开始入门的时候一直在使用[腾讯云 wafer 解决方案](https://github.com/tencentyun/wafer2-quickstart-nodejs)，随着开发的进行，发现一些问题：

1. 客户端、服务端代码在同一个项目里面，而客户端是网页 js，服务端是 Nodejs，两者有完全不同的库，比如客户端无法使用 `await/async`、`Buffer`、`process.env`、npm 安装依赖等等。

2. 效率极其低下，每次写完服务端代码需要『上传 -> 安装依赖 -> 重启』 2 -3 分钟，遇到错误还得远程调试，连接过程更是长达 1 分钟左右。

3. 只能通过 phpMyAdmin 连接数据库，knex 的 migration 功能无法实现，这意味着测试数据的添加必须直接修改服务端逻辑代码！

经过长时间的开发、不断查阅资料，终于找到了一些解决办法。

## Koa + Knex

现在主要流行的服务端一般都是采用 RESTful API，最经典的就是 GitHub API v3、豆瓣 API 等等。RESTful 使用 GET、POST、DELETE、PUT 等 HTTP 动词表示进行什么操作，而请求路径一般只包含名词。强烈推荐仔细读一读 [Building a RESTful API with Koa and Postgres](https://mherman.org/blog/building-a-restful-api-with-koa-and-postgres/)。另外还有一套状态码的规范，这些可以随时 Google。

由于刚开始使用的 wafer，也就延续了 Koa 框架和 Knex query builder，主要使用了 Koa 的中间件功能添加一些路由，`knex` 则用于查询修改数据库，支持 MySQL、Postgres 各种数据库，不用了解太多 SQL 语言就能轻松上手，遇到不会的随时查阅 knexjs.org。 

关于 Koa 的上手推荐读一读 [Koa 框架教程](http://www.ruanyifeng.com/blog/2017/08/koa.html)，『中间件』是在 Koa 中用到最多的了，及其简洁。

在使用 Knex 的时候可能会遇到一些问题是 SQL 相关的，除了要查阅 Knex 的文档以外，可以再看看 SQL 相关的内容。比如说中文字符串需要用到 `.collate('utf8_unicode_ci')` 就需要看看 MySQL 的文档到底有哪些可用的字符集，分别表示什么含义。

## 测试优先

测试非常重要，我一般是一边测试一边写文档。首先写好测试文件，运行 `npm test` 不通过之后，然后再写相关的实现代码，如果遇到错误了就需要使用 Postman 这样的工具来帮助调试，顺便把测试用例加到 API 文档中。

测试使用的是 `mocha`、`chai`、`chai-http`。

`npm test`:

```
node ./node_modules/mocha/bin/_mocha --timeout 10000
```

## 开发环境 & 生产环境

两种环境的部署已经在 GitHub 里面的 [README.md](https://github.com/upupming/HITMers-node-js-server/blob/dev/README.md) 写好了，在本地部署开发环境效率会高许多。在安装 Nginx、php、MySQL 的过程中 [Nginx with PHP and MySQL on Windows 7](https://www.chanhvuong.com/2809/nginx-with-php-and-mysql-on-windows-7/) 的帮助很大。在 `package.json` 中定义了 `npm run dev` 的命令：

```bash
nodemon --inspect --config nodemon.json src/app.js
```

`--inspect` 参数用于在 `chrome://inspect` 中连接到 Node.js 进程进行调试。

由于我使用的 MySQL 版本是 8.0，在运行 Knex 的时候遇到了一个关于授权机制 `caching_sha2_password` 小问题，我在 Stackoverflow 上总结了一下[解决方案](https://stackoverflow.com/questions/50093144/mysql-8-0-client-does-not-support-authentication-protocol-requested-by-server/51918364#51918364)。

生产环境使用的是免费的 [Heroku](https://devcenter.heroku.com/)，它提供免费的 Postgres 数据库是唯一靠谱的数据库（其他如 MySQL 限制数据库连接数、数据库大小 5M 等等）。最棒的是 Heroku 支持自动构建，与 GitHub 仓库关联之后可以像 Travis 一样针对每个 commit 进行构建。唯一的缺点是在国内访问网速有点差。但是可以通过使用 Heroku 的自定义域名功能，并使用 [360 网站卫士](https://wangzhan.360.com) 给网站加一个 CNAME 记录解析到 Heroku 应用域名（例如：hitmers.herokuapp.com），再上传自己申请的 SSL 证书就可以开启 https。实际测试 360 网站卫士可以很好地加速对 Heroku 的访问速度。

在开发过程中经常需要用到私密性的环境变量（密码等等），可以借助 `dotenv` 将这些变量存在 `.env` 文件中并让 git ignore 掉。生产环境在 Heroku 后台中添加上即可。

另外 Heroku 在运行 Node.js 时注意监听端口一定要使用 `process.env.PORT`，这是 Heroku 预留的环境变量，如果尝试监听在其他端口会运行出错，参见[这篇帮助](https://help.heroku.com/P1AVPANS/why-is-my-node-js-app-crashing-with-an-r10-error)。

## 授权机制

虽然说小程序发布之后是闭源的，但实际上小程序包文件 `wxpkg` 是存储在 `/data/data/com.tencent.mm/MicroMsg/.../appbrand/pkg/` 之下的（安卓机型），而且解压之后经过一些处理源代码可以得到很好的复原，GitHub 上已经有了获取任何小程序源代码的项目 [wxappUnpacker](https://github.com/qwerty472123/wxappUnpacker)，我经过测试发现是完全可以复原源代码的，因此将 API 域名路径保密（比如使用 domain.com/v1/qwedcdgrtrfdss!@#de 作为 API 路径）防止非法数据访问的思想是不可取的。

为了防止数据泄露，我们需要验证用户信息。一种简单的方法是使用 token 进行验证，HITMers 借鉴了 [Securing Node.js RESTful APIs with JSON Web Tokens](https://medium.freecodecamp.org/securing-node-js-restful-apis-with-json-web-tokens-9f811a92bb52)，基本思想是每次登陆返回给用户一个 token，以后用户每次发送请求都需要提供这个 token，否则返回 `401 Unauthorized`，这在 Koa 中实现起来非常简单，只需在所有 API 之前都加上一个 [`verify` 中间件](https://github.com/upupming/HITMers-node-js-server/blob/dev/src/controllers/verify.js)。

## Travis-CI & Coveralls

Travis 持续集成很重要，能够确保之前的功能没有被破坏，Travis 的配置主要在 MySQL 的配置上有点问题，参见 [issue](https://github.com/travis-ci/docs-travis-ci-com/issues/1605)。为了数据库中的 `date_time` 跟本地调试结果一样，还要设置好时区为 `Asian/Shanghai`。其中还用到了一些 Knex migrate 和 seed 的命令初始化数据库加入测试数据，参见 [package.json](https://github.com/upupming/HITMers-node-js-server/blob/dev/package.json) 中的 `knexinit` 命令。

Coveralls 用来反馈代码测试覆盖率，配置过程参考了 [Node + Mocha + Travis + Istanbul + Coveralls: Unit tests & coverage for your open source project](http://dsernst.com/2015/09/02/node-mocha-travis-istanbul-coveralls-unit-tests-coverage-for-your-open-source-project/)。

# 总结

开发完整个项目，发现主要是要学习很多新的东西，我到现在还在不断学习中。刚开始真的毫无头绪，不知不觉就慢慢地缕清晰了。还是要多写代码、多看别人怎么写的、再看看别人的文章掌握以下设计思想，效率就能够提高很多。

# 外部链接

1. https://mherman.org/blog/building-a-restful-api-with-koa-and-postgres/
2. https://www.chanhvuong.com/2809/nginx-with-php-and-mysql-on-windows-7/