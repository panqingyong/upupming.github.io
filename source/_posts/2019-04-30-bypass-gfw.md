---
title: 科学上网原理与方案
tags:
  - GFW
  - 科学上网
categories:
  - GFW
date: 2019-04-30 19:08:20
---


这次给大家分享一下自己平时『科学上网』的一些经验，主要为了：

1. 理解 GFW 的工作原理，从而引出相关对策
2. 分享一些解决方案，常用工具等等

<!-- more -->

## 入门

一个简单的问题，当你拿到一台普通电脑，此时怎么快速翻墙？

我会这样做：

1. 打开 github.com/getlantern
2. 找到『蓝灯最新版本下载』，进入下载，安装即可。
3. 开始 Google，查找更多工具……

> 注：GitHub 的 releases 的是托管在 Amazon S3上的，网速受到 GFW 的干扰，截止 2019.04.28 可以看到蓝灯直接把下载文件存在了 GitHub 仓库里面，这样网速会快一些，因为 github.com 的域名平时基本上都是没有受到 GFW 干扰的。

有了 Lantern，你就可以访问 Google 了，接下来就可以查阅更多被墙住的资料，进而寻找更好的翻墙方案。后面的部分我们等讲完 GFW 原理再说~

## GFW 原理

> 因为 GFW 的内部工作原理是不公开的，我自己也不是专业研究 GFW 的，所以这一部分所以只是带领大家初步了解一下，可能不会特别深入，甚至有些许小错误，如果发现错误，希望大家谅解并及时帮忙指正，谢谢！

### 基础知识

下面的内容受启发于前端经典面试题：『从浏览器输入 URL 之后，会发生什么？』

#### DNS

当你在浏览器中输入 www.baidu.com 时，浏览器并不能直接根据这串字符确定目标主机的地址。baidu.com 被称为域名（domain），我们要真正访问到域名下的资源，需要首先进行域名解析，这就需要用到 DNS（域名解析系统），获取到服务器的 IP 地址之后再向 IP 发送请求。我们可以把 DNS 简单地理解为域名到 IP 的映射。

比如我再 Windows 下，可以使用自带的 `nslookup` 命令进行 DNS 查询：

```cmd
C:\Users\Doraeming>nslookup www.hit.edu.cn
Server:  UnKnown
Address:  192.168.1.1

Name:    www.hit.edu.cn
Address:  61.167.60.70
```

前两行显示的是 DNS 服务器的域名和 IP 地址，后两行显示的是要查询的域名和查询结果。

DNS 更深入的内容这里不再详细展开，推荐大家阅读 Computer Networking: A Top-Down Approach。

#### HTTP & HTTPS

HTTP (Hypertext Transfer Protocol) 中文叫做超文本传输协议，从下图中可以看到，在平时所用的 TCP/IP 模型和 OSI 参考模型中都位于最上层，是离我们日常使用最近的协议啦。大家看一下最下层的物理层，那是最接近硬件的一层了，那里有大家常常听说的以太网的协议。

![tcp-and-osi-model](http://fiberbit.com.tw/wp-content/uploads/2013/12/TCP-IP-model-vs-OSI-model.png)

> 每台主机有许多端口可以提供用来套接字服务，端口号在 [1, 65535] 之间。  
> 基础知识：HTTP 的周知端口号是 80，HTTPS 的周知端口号是 443。本地主机的回环测试 IP 地址为 127.0.0.1（或者 0.0.0.0），DNS 服务的周知端口号是 53。1024 以下的端口号是系统端口号，在 Linux 中开启需要 root 权限。

由于 HTTP 的传输报文是明文，所以非常不安全，人门于是将 SSL(TLS) 和 HTTP 结合，在 HTTP 进入 TCP 报文段之前，先经过 SSL 对 HTTP 报文进行加密这就产生了 HTTPS。关于 HTTPS 的具体认证过程推荐大家看一下[阮一峰老师的博文](http://www.ruanyifeng.com/blog/2014/09/illustration-ssl.html)。

温馨提示：大家在访问网站的时候一定要尽量用 https，推荐使用 Firefox、Chrome 这种现代化的浏览器，使用 IE 浏览器上网简直就是在裸奔，IE 在安全性和 JS 新特性支持上都表现的很差劲，如今很多前端项目也逐渐放弃了对旧版本 IE 的支持，如 GitHub 上最火的前端项目 Bootstrap 等等。国内的浏览器也不可信，一方面可能不得不配合参与 GFW 的自我审查，我之前遇到过即使翻墙在 360 浏览器中还是无法访问 Google 的情况，另一方面有诸如[红芯浏览器](https://www.leiphone.com/news/201808/tSIjaHWIXcBnjuD5.html)这种无良商家，不建议使用。相反 Firefox 和 Chrome 的插件系统会让用它的人爱不释手，开发者也不得不依赖于 Chrome 的 dev-tools。

### DNS 污染（DNS 欺骗）

DNS 污染（DNS Spoofing）又称为域名服务器缓存污染，英文为 DNS Cache Poisoning。

由于全球只有 13 个顶级域名服务器，所以为了避免单点故障、减少查询压力等等会有各级缓存。如果你使用的是国外的 DNS 服务器，比如 Google 的 `8.8.8.8`，DNS 查询需要经过国际出口。GFW 会通过技术手段伪造 DNS 的查询结果，这样你查询到的 IP 地址并非域名的真实地址，也就会访问失败。

测试 DNS 是否被污染最佳工具是 [China Firewall Test](http://www.chinafirewalltest.com/)。

### DNS 劫持

DNS 劫持和 DNS 污染是不同的，国内很多的 ISP（Internet Service Provider，中国移动、中国电信、中国联通等等）会**故意修改自己 DNS 服务器上的记录**，把某些敏感网站的记录修改成错误的 IP 地址。

### IP 黑名单

顾名思义，在你请求某个 IP 地址时，如果其恰好在 GFW 的 IP 黑名单上，GFW 会屏蔽这些报文，导致无法正常访问。大家可能经常会听翻墙的朋友这样说：『我那个服务器的 IP 被 GFW 被屏蔽了，我不得不换一台服务器来重新搭建 VPN 服务端。』亲身体验过 IP 被屏蔽会发现那是一件很难受的事情，自己亲手构筑的一切在瞬间就化为了乌有。

测试 IP 是否被墙的最佳工具是[站长工具 Ping 检测](http://ping.chinaz.com/)。

### 敏感词过滤

GFW 会维护一个敏感词列表，经常更新。如果你访问的网页中存在敏感词汇，GFW 也会屏蔽。我们可以通过 Wireshark 抓包来测试，这里不再详细展开。

## 科学上网常用方式

主要是 hosts 和代理两种方案。

关于代理的分类，引用一段[如何翻墙？ | 编程随想的博客](https://program-think.blogspot.com/2009/05/how-to-break-through-gfw.html)的文字：

> 按照是否加密，代理软件可分为加密代理和不加密代理2种（这不是废话嘛:）。为了避开 GFW 敏感词过滤，咱必须得使用加密代理软件。
>
> 按照协议类型，常见的有 HTTP 代理和 SOCKS 代理。如果你纯粹用浏览器翻墙，HTTP 代理就够用了；如果你还需要让其它软件（比如MSN）翻墙，那就得用SOCKS代理。

### 修改 hosts 文件

对于 DNS 污染，我们可以通过 hosts 解决，hosts 的原理是直接在本地指定域名的 IP 地址，跳过 DNS 查询，不同的操作系统及其 hosts 文件目录如下：

- Mac OS X, iOS, Android, Linux: `/etc/hosts`
- Windows: `%SystemRoot%\system32\drivers\etc\hosts`

在 GitHub 上有一些比较好的 hosts，长期维护：

|项目地址|项目简介|
|-------|-------|
|https://github.com/googlehosts/hosts|用来访问 Google|
|https://github.com/StevenBlack/hosts|禁用广告等等网站，对 hosts 中的域名直接返回本地 IP|

hosts 文件中的条目大概长这样：

![Format of hosts](https://i.loli.net/2019/04/28/5cc5b51fb7152.png)

在这里在向大家推荐一款安卓端的软件 [一键 Go Host](https://github.com/Lerist/Go-Hosts)，对于安卓特别友好，可以一键翻墙，不过前提是需要获取 root 权限，这个对大家难度应该不大，推荐在 [xda](https://forum.xda-developers.com/) 中搜索相关教程。

<img src=https://picgo-1256492673.cos.ap-chengdu.myqcloud.com/img/20190428223145.png alt="安卓软件『一键 Go Hosts』" height=500px>

hosts 翻墙的缺点是很明显的：

1. 一些不常用的网站可能不在 hosts 中，就无法访问。
2. hosts 经常失效，因此 hosts 文件本身需要频繁更新，这对于效率要求较高的人来说是一个很麻烦的事。不过我们可以自己写一个脚本，在开机的时候自动从服务器拉取最新 hosts。
3. 对于 IP 黑名单无能为力。

虽然 hosts 有诸多缺点，不过对于普通访问 Google 的需求，hosts 是完全能够满足的，比如在安卓端，能用 hosts 就尽量不要再用其他 VPN，VPN 在我手机里面是最耗电的应用了，没有之一，不过这也与一直开着有关：

<img src=https://i.loli.net/2019/04/28/5cc5b8108e5e2.jpg alt="使用 SSR 用电量高达 85%" height=500px>

### 第三方工具

#### Lantern, etc.

蓝灯（Lantern）虽然网速不算太好，但确实是最老牌的【免费】翻墙软件了，支持的平台广泛，稳定性相对较高（除了在两会等特殊阶段无法使用），一键安装，对新手极其友好。同类的免费软件有很多，这里只简短地列举几个（付费的就不考虑啦），大家要懂得『举一反三』，善用搜索工具。

|软件名称|推荐度|获取方式|
|-------|------|-------|
|[Lantern](https://github.com/getlantern/download)|:star: :star:|GitHub 主页|
|[XX-Net](https://github.com/XX-net/XX-Net)|:star: :star:|GitHub 主页|
|[VPN Gate](https://www.vpngate.net/cn/)（需翻墙）|:star: :star:|网站主页|
|[赛风](https://psiphon.ca/)（需翻墙）|:star:|发送邮件给 [get@psiphon3.com](mailto:get@psiphon3.com)|

#### Tor, etc.

Tor 全称为 The Onion Router（洋葱路由器），主要的目的是为了保护用户的隐私，有助于在你上网时，帮你隐匿自己的真实公网 IP，用户可透过 Tor 接达由全球志愿者免费提供的出口节点，当然自己也可以作为志愿节点做贡献，翻墙只是它的副作用。Tor 的功能特别强大，但同时因为这款软件主要是为了安全性考虑的，面向的用户也比较高端，不推荐新手使用。我曾经在服务端部署 Shadowsocks 的时候使用 [proxychains](https://github.com/haad/proxychains) 作为 Shadowsocks 的前置代理，这样可以让访问的网站无法得知我的服务器 IP 地址，是一个很能保护隐私的配置，但实际测试网速是比较慢的，网速慢算是 Tor 最大的缺点了。如果我们要在本地电脑上使用的话，需要下载 Tor Browser（基于开源的 Firefox 开发），配置好 meek 流量混淆插件，就可以使用啦，推荐大家看[这篇文章](https://program-think.blogspot.com/2014/10/gfw-tor-meek.html)（需翻墙），网速的话确实比较慢，在安全和网速之间，鱼和熊掌不可兼得。类似的安全类软件还有 I2P。

注：获取方法为发送邮件给 [gettor@torproject.org](mailto:gettor@torproject.org)

### 自行搭建代理

对于真正的软件开发者，自行搭建代理才是王道，其他的要么稳定性差，要么网速慢，等等。自行搭建的前提都是需要有一台『服务器』（Server），在网上搜索 VPS 可以得到很多提供商，个人推荐的有：

1. [vultr](https://www.vultr.com/?ref=7200829)
2. [搬瓦工](https://bandwagonhost.com/)

> 温馨提示：我之前用的 vultr，后来因为时断时续（哈工大校园网），现已弃用。具体情况推荐自行测试。

#### Nginx、Node.js 反向代理

反向代理的基本原理是利用中继服务器（没有被墙）访问得到原始网站的信息之后，返回结果给客户端。优点是客户端拿到镜像网址即可，访问的行为与原网址一模一样，缺点是无法实现登录等复杂操作。

我自己在 GitHub 上创建了一个小的项目，主页在 github.com/upupming/Mirror， 分为 0.0.1 和 0.0.2 两个版本（两个分支），前者是分享的 Nginx 反向代理搭建教程和 `nginx.conf` 配置，后者直接使用 now.sh 提供的服务（无需自建服务器，是【免费】的）来托管一个 [Koa](https://github.com/koajs/koa) 服务端，这个服务端可以实现对单个域名的反向代理，通过脚本批量代理可以代理很多子域名。

由于 now.sh 也是托管在 AWS 的 [lambda](https://aws.amazon.com/lambda/) 上的，受 GFW 影响速度比较慢，所以只适合于平时没有翻墙但是想快速访问 Google 的情况。

推荐大家即刻体验：https://google.upupming.site，如需了解更多，请访问 https://mirror.upupming.site/。

#### now.sh 类似

除了 now.sh 可以用来搭建反向代理，其他可以用来托管 Node.js、PHP 或者其他服务端应用的平台也是可以的，不过大家在托管之前**一定要详细阅读 ToS（服务条款）**，因为有些服务提供商是明确禁止搭建代理服务器的，比如[在 heroku 上搭建 Shadowsocks 被 heroku 封号](https://github.com/onplus/shadowsocks-heroku/issues/150)。

- Google Firebase Functions
- 000webhost
- netlify
- heroku
- ...

#### Shadowsocks & V2Ray

Shadowsocks 项目由 clowwindy 发起，最初只是他自己个人用来翻墙的，后来才越做越大。这所有的历史都记录在了[JadaGates/ShadowsocksBio](https://github.com/JadaGates/ShadowsocksBio)。SS 是至今为止最稳定、用户数最多的翻墙软件了，不管最初选择如何，似乎大家最终的选择都会倾向于它。

大家进入 [Shadowsocks](https://github.com/shadowsocks/shadowsocks) （简称为 SS） 会发现项目被删除了，其实只是展示的 `rm` 分支罢了（应该当时为了应对特殊情况才这样做的），把分支切换成 `master` 就好了，Shadowsocks 至今仍在维护，并且 Linux 各大软件包管理器也可以直接安装，Windows、Linux、macOS、Android 和 iOS 等等全都支持。

Shadowsocks 的搭建推荐使用脚本即可，请阅读 https://shadowsocks.be/ （需翻墙），由于网上的教程很多，这里不再重复介绍，请大家善用搜索。遇到问题及时翻阅 GitHub 上的 [Wiki 页面](https://github.com/shadowsocks/shadowsocks/wiki)。

[v2ray](https://github.com/v2ray/v2ray-core) 是新兴的代理软件，发展迅猛，可以看[这篇文章](https://oing9179.github.io/blog/2016/11/v2ray-More-Complex-and-Better-than-Shadowsocks/)。搭建过程比 SS 复杂，但不算太难，但是需要有一些基础知识，与搭建 Nginx 反向代理的难度相差不大，推荐大家直接查阅官方文档。

对于刚入门计算机的同学，推荐先看[这篇文章](http://www.evernote.com/l/AmEIfRIK0H9LE5XUla9dVz21Q8NQ5sVaxMM/)，可以先使用一些小型服务提供商的代理服务。

更高级的一些操作还有[中继](https://sjq597.github.io/2018/05/22/ShadowSocks-Haproxy%E4%B8%AD%E7%BB%A7/)，可以使用国内服务器作为中继节点，连接国外的服务器达到更快的速度。

##### 代理模式设置

大家在代理过程中经常遇到一些小问题，这里稍作解释。

在开启 Shadowsocks 之后，可以选择代理方式：

![ss-mode](https://picgo-1256492673.cos.ap-chengdu.myqcloud.com/img/20190429003221.png)

这三种模式其实影响的是系统中的『Internet 选项』或者『代理设置』（Windows 10）：

![Windows Internet Options](https://picgo-1256492673.cos.ap-chengdu.myqcloud.com/img/20190428212136.png)

其他软件看到系统中的配置后，会遵循其中定义的代理地址，比如这里是 127.0.0.1（本地回环地址）的 1080 端口（SOCKS 代理默认端口），就会把请求发送到这个端口。

但是对于终端，特别是 Linux 下无时无刻不会用到的的 bash 和 Widows 的 cmd、PowerShell，它们是不会认这个系统设置的，我们必须**为终端的每条命令单独配置代理**，常用的有：

1. [git](https://stackoverflow.com/questions/15227130/using-a-socks-proxy-with-git-for-the-http-transport)
2. [curl](https://www.cyberciti.biz/faq/linux-unix-curl-command-with-proxy-username-password-http-options/)

对于一些命令自身实现不了的（比如 `npm install`），我们可以用 `tsocks` 和 `proxychains` 来实现，限于篇幅，这里就不再介绍啦。

另外推荐 Chrome 的插件 [SwitchyOmega](https://github.com/FelisCatus/SwitchyOmega)，配置过程参见[官方 Wiki](https://github.com/FelisCatus/SwitchyOmega/wiki/GFWList)，它能让 Chrome 忽略系统的代理设置，直接走软件本身的配置，在软件内部加一个 gfwlist，每次遇到新的被墙的网站还可以自行添加域名，比较方便，推荐使用。

温馨推荐：如果使用 Linux 的话，推荐看一下我的[配置教程](https://gist.github.com/upupming/b3f837c912d2c6291baef0db0e72f7a6)（gist 需翻墙）。

#### 路由器代理

路由器代理可以解决一些终端命令无法配置代理的情况（比如 [Firebase CLI](https://github.com/firebase/firebase-tools/issues/155)），这样即使本地电脑电脑上不配置任何代理，只要通过路由器联网了，就能翻墙。

路由器代理可以参见：

1. 极路由：https://github.com/qiwihui/hiwifi-ss
2. 刷【梅林固件】，再安装 Shadowsocks 插件，自行搜索相关教程即可

说到路由器代理，不得不向大家推荐 [SSTap](https://www.ccava.cc/2731.html)，可以在本地创建虚拟网卡，达到路由器级别的代理，而且可以开机自启。

## 翻墙之后值得推荐的网站

1. Google 域名内搜索 - 精准获取想要的信息

    ![Google search in site](https://picgo-1256492673.cos.ap-chengdu.myqcloud.com/img/20190428224938.png)

2. [StartPage](https://startpage.com/)，更尊重隐私的 "Google"
3. [中文维基百科](https://zh.wikipedia.org/wiki/Wikipedia:%E9%A6%96%E9%A1%B5)，更尊重事实的百科全书
4. [medium](https://medium.com/)，最优质的英文博客平台
5. [Quora](https://www.quora.com/)，知乎之父
6. ...，更多精彩待你探索~

## 总结

这篇文章主要对 GFW 的原理进行了粗浅的分析，同时给出了理论上、实践上的一些对策，希望能够给你带来些许帮助，特别是刚上大学不知道该怎么有效获取信息的同学~

## 参考资料

1. [图解SSL/TLS协议](http://www.ruanyifeng.com/blog/2014/09/illustration-ssl.html)
2. [在浏览器地址栏输入一个URL后回车，背后会进行哪些技术步骤？](https://www.zhihu.com/question/34873227)
3. [从输入URL到页面加载发生了什么](https://segmentfault.com/a/1190000006879700)
4. [中国防火墙长城GFW的拦截原理概析](https://www.svlik.com/1804.html)
5. [扫盲 DNS 原理，兼谈“域名劫持”和“域名欺骗/域名污染”](https://program-think.blogspot.com/2014/01/dns.html)
6. https://github.com/gfwlist/gfwlist
7. [浅谈部分机场（SS/SSR提供商）的使用感受--毒药笔记持续更新中](https://www.evernote.com/shard/s609/client/snv?noteGuid=087d120a-d07f-4b13-95d4-95af5d573db5&noteKey=43c350e6c55ac4c3&sn=https%3A%2F%2Fwww.evernote.com%2Fshard%2Fs609%2Fsh%2F087d120a-d07f-4b13-95d4-95af5d573db5%2F43c350e6c55ac4c3&title=%25E6%25B5%2585%25E8%25B0%2588%25E9%2583%25A8%25E5%2588%2586%25E6%259C%25BA%25E5%259C%25BA%25EF%25BC%2588SS%252FSSR%25E6%258F%2590%25E4%25BE%259B%25E5%2595%2586%25EF%25BC%2589%25E7%259A%2584%25E4%25BD%25BF%25E7%2594%25A8%25E6%2584%259F%25E5%258F%2597--%25E6%25AF%2592%25E8%258D%25AF%25E7%25AC%2594%25E8%25AE%25B0%25E6%258C%2581%25E7%25BB%25AD%25E6%259B%25B4%25E6%2596%25B0%25E4%25B8%25AD)
