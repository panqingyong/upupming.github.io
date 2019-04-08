---
title: 中国的网络状态
date: 2019-03-24 16:28:10
tags:
- GFW
- 科学上网
categories:
- GFW
---

这篇文章将记录中国的网络状态及自己的上网现状，并且一直更新。记录自己连上 Google, Wikipedia 等外网的艰辛历程。

<!-- more -->

## 2019 年 3 月 24 日

### 彻底弃用 [vultr](https://www.vultr.com/?ref=7200829)

昨天晚上花了几个小时的时间测试了 vultr 的所有地区的服务器，基本上都是 lost 较高的状态，平均延迟在 450ms 左右。

- Toronto: Lost/Received 2/2
- Amstersdam: Lost/Received 3/1
- Paris: 11/6
- Frantfurt: 25/3, 24/2, 20/6
- London: 28/4, 22/6, 47/3
- Sydney: 30/2，延迟有点高,61/7
- Seattle: 30/3, 63/4
- Loa Angeles: 完全不行
- ……

除了 vultr 自己的 IP 被封的比较厉害以外，我发现还有一部分原因是哈工大校园网自己对海外节点的访问出了问题：有时校园网 ping 任何一个海外 IP 都 ping 不通，有时非常顺畅，时好时坏，这个变换条件也不知道，实在难以测试。在我写文章的这一刻我又测试了一下：

<details><summary>baidu & wikipedia 的 ping 测试结果</summary>

```cmd
C:\Users\Doraeming>ping baidu.com

Pinging baidu.com [220.181.57.216] with 32 bytes of data:
Reply from 220.181.57.216: bytes=32 time=29ms TTL=49
Reply from 220.181.57.216: bytes=32 time=29ms TTL=49
Reply from 220.181.57.216: bytes=32 time=32ms TTL=49
Reply from 220.181.57.216: bytes=32 time=28ms TTL=49

Ping statistics for 220.181.57.216:
    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),
Approximate round trip times in milli-seconds:
    Minimum = 28ms, Maximum = 32ms, Average = 29ms

C:\Users\Doraeming>ping en.wikipedia.org

Pinging en.wikipedia.org [208.80.154.224] with 32 bytes of data:
Request timed out.
Request timed out.
Request timed out.
Request timed out.

Ping statistics for 208.80.154.224:
    Packets: Sent = 4, Received = 0, Lost = 4 (100% loss),

C:\Users\Doraeming>ping en.wikipedia.org

Pinging en.wikipedia.org [198.35.26.96] with 32 bytes of data:
Request timed out.
Reply from 198.35.26.96: bytes=32 time=299ms TTL=46
Reply from 198.35.26.96: bytes=32 time=300ms TTL=46
Reply from 198.35.26.96: bytes=32 time=298ms TTL=46

Ping statistics for 198.35.26.96:
    Packets: Sent = 4, Received = 3, Lost = 1 (25% loss),
Approximate round trip times in milli-seconds:
    Minimum = 298ms, Maximum = 300ms, Average = 299ms

```

</details>

弃用 vultr 唯一的遗憾就是之前辛苦建好的 [Mirror](https://github.com/upupming/Mirror) 不复存在了，不过这也是无可奈何之举呀，相信有一天我会找到更好的解决方案。

<hr>
2019.04.08 更新

Mirror v0.0.2 已经发布，使用 `now.sh` 就可以搭建镜像啦！

<hr>

### 寻找其他高质量的 VPS/SS 提供商。

我们学校的校园网对国内的 IP 基本上都能 ping 得通，我还想过使用阿里云/腾讯云来当 vultr 的中继节点的方法，参考了 [ShadowSocks+Haproxy中继](http://sjq597.github.io/2018/05/22/ShadowSocks-Haproxy%E4%B8%AD%E7%BB%A7/)，使用 Haproxy，配置非常简单。可惜阿里云价格实在是太贵了，我不小心把带宽调到了 30Mbps，结果两天不到 100 元就没有了。要想在 vultr 网络带宽是超快的，而且并不需要付费，国内的网络还是与国外有很大的差距，价格贵、网速慢。再加上要维护两台服务器也比较费劲，所以放弃了这种方法。

其他的类似 vultr 的提供商我也无力再去尝试，担心结果和 vultr 是一样的，最终只好选择利用别人已经搭建好的 Shadowsocks 服务，这样速度、稳定性也都会有保证一些，毕竟有专门人员来检测网络状态。

最终找到了一家小众的 Shadowsocks 服务提供商，看上去比较可信赖，官网做得很用心，文档齐全，又是中国人自己做的，于是就使用了。大家可以参考一下[浅谈部分机场的使用感受](http://387089.blogspot.com/2018/09/ssssr.html)，里面有许多小众的提供商值得尝试一下。

### 使用 SSTap 进行网卡级别的代理

最初见到这个方法是在之前使用 Firebase 的 functions 开发的时候遇到的一个命令行无法访问 Google 带来的[问题](https://github.com/firebase/firebase-tools/issues/155)，[yqx1110](https://github.com/yqx1110) 提出 可以使用 SSTap 来解决。现在终于去尝试了一下，发现这个工具真的是非常强大的，配置过程比较简单，可以参考[这里](https://www.ccava.cc/2731.html)。弄完之后就相当于是在路由器上连接了 Shadowsocks 代理，本地的一切软件都走了 SSTap 的代理，不用再用任何类似 `set http_proxy...`, SwitchyOmega, SS-Windows 的软件了。

正所谓工欲善其事必先利其器，Google + Wikipedia 能让我们的工作效率提升很多倍，这也正是我愿意如此折腾的原因。至此，这阶段算是安稳下来了，应该能够好好地使用网络了。