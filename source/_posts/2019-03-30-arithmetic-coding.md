---
title: 小工具：算数编码 npm 库
date: 2019-03-30 23:49:28
tags:
- arithmetic coding
- algorithm
categories:
- 项目
- Node.js
---

最近花了 4 天时间写了一个算数编码的库 [arithmetic-coding](https://github.com/upupming/arithmetic-coding)，算是自己开发的第一个比较规范的 npm 库，在此分享详一些相关的经验，希望能帮助到朋友们。

![ari-coding-test.gif](https://i.loli.net/2019/03/30/5c9f90d37bed8.gif)
![file-size-before-and-after-compress](https://i.loli.net/2019/03/30/5c9f90e8316e3.png)

<!-- more -->

## 算法的基本原理

算数编码的介绍在网上有很多相关的资料，我查到比较好的资料有：

1. [Wikipedia](https://en.wikipedia.org/wiki/Arithmetic_coding)
2. [Data Compression with Arithmetic Encoding](http://www.drdobbs.com/cpp/data-compression-with-arithmetic-encodin/240169251)

前者是了解一下算数编码的基本思想，后者是实际写代码中需要考虑到的东西。

在哈夫曼编码中，每个消息由固定长度的位表示，例如 `1234` 会被编码为：

```txt
|01001|11|0001|011|
|  1  | 2|  3 | 4 |
```

但是在算数编码中，一整串消息由一个数字表示，可以说所有的消息共享所有的编码位：

```txt
|010010111010|
|1 2 3 4     |
```

算数编码的输出通常是一串二进制位流，我们认为其总有一个前缀 0，将二进制位流作为一个二进制的小数部分，最终得到的结果必然在 0 - 1 之间：

```txt
01101010 -> [0.]01101010
```

算数编码的原理就是把长为 $m$ 的输入映射到 $[0, 1)$ 区间，然后选择其中的一个点来表示这个输入序列。

在解码过程中，我们将一个二进制小数看成是一个区间，我们称之为**编码区间**。例如：

- `.11` 表示 $[.11\text{\.{0}}, .11\text{\.{1}}] = [.75, 1.0)$
- `.101` 表示 $[.101\text{\.{0}}, .101\text{\.{1}}] = [.625, .75)$

编码区间长度越短，所需要的位数越多。如果编码区间之间互相步交叠，我们称这样的编码为前缀编码。

为了找到前缀编码，只需要找到编码区间位于序列区间之间的编码即可。

**消息区间**是一条消息所在的区间，在字符集中每个字符对应一个区间：

![区间划分](https://i.loli.net/2019/03/26/5c999f7deccf0.png)

看懂下面的图，大家对整个过程就应该理解了：

![编码过程](https://i.loli.net/2019/03/26/5c99a1dea0bb0.png)

![解码过程](https://i.loli.net/2019/03/31/5c9f9533369c0.png)

在实际实现时，最大的问题就是随着数据的增长，我们编码的小数位数不断增长，直接使用 js 里面的 `number` 不够用，我在网上查了 [bignumber.js](https://github.com/MikeMcl/bignumber.js/) 等等其他的库，这些都是不够用的。

唯一的办法就是转变思路，通过两个关键思想来改进理论上的算法：

1. 不再使用 `double` 型数据表示 `high`, `low`, `Tag`，而是直接使用长二进制变量。
2. 为了是程序能够处理任意长度的二进制数，必须一位一位地进行处理，在位被读进的同时，进行计算并返回结果，已经读入的位在后续无需进行处理，可以直接抛弃。

大家感兴趣可以深入研究一下第 2 篇文章，讲得非常详细易懂。

## 代码实现

找到了一个非常好的项目 [Reference-arithmetic-coding](https://github.com/nayuki/Reference-arithmetic-coding)，已经实现了 Java, Python, C++ 的代码，于是我就在此项目的基础上，开始写 node.js 版本的库函数。

项目结构大致如下：

- `arithmetic-decoder.js`: 算数解码器
- `arithmetic-encoder.js`: 算数编码器
- `bit-input-stream.js`: 输入流处理辅助类
- `bit-output-stream.js`: 输出流处理辅助类
- `decode.js`: 解码驱动函数
- `encode.js`: 编码驱动函数
- `frequency-table.js` 存储频率表的类

在实际写的过程中体会到的最大两个痛点是：

1. js 里面写文件非常不好处理，可能是自己不太熟悉的缘故，开始使用 `fs.createReadStream` 发现不是很好实现在需要的时候去读取新的字节，只能在回调函数中被动地处理读到的字节。后来全部替换为了 `fs.readSync`。
2. js 里面 `number` 不分整形浮点，移位操作最多只能移 31 位，这就会造成许多问题，另外还没有 unsigned 类型，经常出现移出负数的情况，这就需要通过 `>>> 0` 来校正。中间尝试使用 [long](https://www.npmjs.com/package/long) 来解决，但是此库的效率太过低下，导致几次 [build 超时](https://travis-ci.com/upupming/compressjs/builds/106385443)，我是通过 [node.js profile](https://nodejs.org/es/docs/guides/simple-profiling/) 才发现问题是 long 引起的的，最终果断弃用，以后需要开发需要长整型的，建议大家还是别选择 Node.js 了。不过这里的算数编码算法可以通过降低总位数来解决，所以最后还是一切顺利。

后来又增加了对 `Buffer` 以及 CLI 的支持，不过整体算法没有多大的改动。

大家可以运行 `npm i -g arithmetic-coding` 安装好之后测试一下，大家可以看文首的截图，那就是运行的效果，实际测试还不错。不过我还没有想到具体的应用场景，大家用得到的话可以评论留言让我知道。

## 项目地址

https://github.com/upupming/arithmetic-coding