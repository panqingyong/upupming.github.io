---
title: 软件的多维度视图
tags:
  - software construction
  - java
categories:
  - 编程语言
  - Java
date: 2018-06-22 16:22:19
---


软件构造（software construction）的核心就是从不同角度审视软件系统，做到在各方面的兼顾。先要搞清楚我们要关注的点，才有软件构造可言。

软件构造视图主要分为 Build-time 视图和 Run-time 视图。他们又分为了 Monment 和 Peroid 两部分，每部分都要考虑到 Code-level 和 Component-level 的细节。

<!-- more -->

+ Build-time(构建时)

  + Moment（时间点）

    - Code-level（代码层次）

      源代码（Source Code）、抽象语法树（AST）、Interface-Class-Attribute-Method

      引入*[类图（Class diagram）][uml]*更简明地表示这些关系。

    - Component-level（组件层次）

      包结构（Package）、源文件（Source Files）、静态链接（Static linking）、测试用例（Test cases）、构建脚本

      引入*组件图（Component diagram）*更简明地表示这些关系。

  + Period（时间段）

    - Code-level（代码层次）

      代码变化（Code Churn）

    - Component-level（组件层次）

      配置项（Configuration item）、版本控制（Version）


+ Run-time（运行时）

  + Moment（时间点）

    - Code-level（代码层次）

      快照图（Snapshot diagram）、内存导出（Memory dump）

    - Component-level（组件层次）
  
      包结构（Package）、库（Library）、动态链接（Dynamic linking）、配置（Configuration）、数据库（Database）、中间件（Middleware）、网络（Network）、硬件（Hardware）

      引入*部署图（Deployment diagram）*更简明地表示这些关系。

  + Period（时间段）

    - Code-level（代码层次）

      Execution trace（执行轨迹）

    - Component-level（组件层次）

      事件日志（Event log）
    
    引入*序列图（Sequence diagram）*更简明地表示这些关系。
    
# Build-time views

## Moment

### Code-level 

源代码中的类、接口、函数、方法等代码块逻辑结构通常有三种组织形式。

1. 语汇层面（**Lexical**-oriented source code）

在语汇层面，代码可以是半结构化的。在遵循特定的**编程语法**的基础上可以多使用**近乎自然语言的风格**，便于程序员理解。特别是变量、方法的命名，注释的使用。

2. 语法层面（**Syntax**-oriented program structure）

*抽象语法树（Abstract Syntax Tree）*是将代码转换之后得到的树结构，很多软件都有很好的抽象语法树结构。基于抽象树的分析通常很有效。

3. 语义层面（**Semantics**-oriented progam structure）

*UML 类图*表示了类之间的相互联系，能够看出源代码的具体目标是什么。在设计 ADT 时首要的事情就是要弄清楚个各类之间的联系，它们怎么分工最合理。

<figure class=not-code><img src=proxy-uml.png>
<caption>代理设计模式的 UML 类图</caption>
</figure>

### Component-level

*源文件（Source Files）*需要有比较好的组织结构，比如下面是 `nodejs` 的目录结构。

<img src=node-files.png>

源文件被组织成包结构、组件。一些可复用的代码或是第三方 API 以*库文件（Libraries）*的形式以*静态连接（Static linking）*的方式加以调用。静态链接会把库文件拷贝进源代码与之形成整体，在实际运行的时候无需再提供库文件，这正是与动态链接的区别所在。这里包括自己 Java 自带的库、平时积累的库、其他开发者提供的库。另外有关 [Gradle 的使用][gradle]我已经写过博文，详细介绍了它的使用方法。

*测试用例（Test cases）*必不可少，不对自己开发的软件进行测试的开发者是不合格的。MIT 6.031 中非常详细地介绍了软件测试的核心思想：**测试优先**。当我们着手写代码时，源代码与测试代码要同时跟进。甚至可以先写出测试代码，即自己想得到的软件的表现；然后再去写源代码满足测试用例。

*组件图（Component diagram）*表示了一个复杂系统中各个组件之间是如何相互协调的。

<figure class="not-code"><img src=component-diagram.png>
<caption>在线购物网站的组件图（来自哈工大软件构造课程）</caption>
</figure>

可以看到搜索引擎、供应商、购物车、授权应用、顾客、订单这些组件的相互关系。

## Period

### Code-level

经常使用 GitHub 的人相信对*代码变化（Code churn）*已经是非常熟悉了。我们可以在本地用 `git diff` 查看文件的变化，也可以在 GitHub 中看到每一次 commit 变化了哪些内容。

<img src="github-diff.png">

### Component-level

配置项（Configuration Item）是什么？

下面是[标准定义][ci-def]。

> In other words, a configuration item can be a **primitive component** or an **aggregate of other configuration items**. With the help of processes and tools, configuration management looks after the configuration items, especially with regards to **change management, status accounting, identification and any audits**. Common configuration types include **software, hardware, communications, location and documentation**. Configuration items have specific attributes as well as relationships that are often unique for configuration items underneath them in the particular system.

> Configuration items help in **identifying the components of a system**. In configuration management it helps in **tracking the granular changes** and helps in system maintenance as well for any possible **error detection**.

简单来说，配置项主要记录了各个文件分别是什么版本，比如一个软件系统有 A、B 两个组成部分，可能整个系统的版本选用的 A 处于 1.3 版本，B 则处于 1.2 版本。

<figure class=not-code><img src=ci.png height=300>
<caption>软件配置项（SCI）示例（来自哈工大软件构造课程）</caption>
</figure>

*版本控制（Version Control）*也很重要，一般会用 `v1.0` 这样的数字表示版本。版本号总是递增的，能够很好地帮助追踪用户遇到的问题，也有利于开发者安排进度。

# Run-time views 

## Moment

### Code-level

*快照图（Snapshot diagram）*可以用来描述运行时程序内存中的状态。

<figure class="not-code"><img src=snapshot.png>
<caption>推特消息在程序内的快照（来自 MIT 软件构造课程）</caption>
</figure>

*Memory dump（内存导出）*将当前的程序运行内存导出成文件，便于下一步分析。

### Component-level

*动态链接库（Dynamic linking library）*可以在程序运行时再动态地加载，便于更新、软件间共享。

*配置和数据文件（Configuration and data files）*对程序来所必不可少，许多软件依赖外部文件的配置，或者经常需要读写文件、处理其中的数据。读写文件通常会调用操作系统提供的相应接口。

*分部式程序（Distributed programs）*通常需要多个组件（client/server）在不同地方运行，相互协调配合工作。比如常用的 Shadowsocks。下面是一个大型项目的*部署图（Deployment diagram）*。

<figure class="not-code"><img src=deployment-diagram.png>
<caption>软件部署图（来自哈工大软件构造课程）</caption>
</figure>

## Period

### Code-level

在代码级别我们经常需要对程序进行调试（Execution trace），这是一种低级别的调试，通常错误信息很长（相信您见过 Java 抛出异常时的情况吧，满屏的 `at ...`），格式不固定，不一定告知开发者错误出处。

### Component-level

在组件级别主要关注程序的*事件日志（Event log）*，日志一般要求较严，需要有固定的格式、较好的可读性，知道准确来源。这是一种高层次的调试，通常只会发现那个组件出了问题。比如安卓 Gmali 崩溃了，它可能告知你没有安装 Google Play 服务。

# 总结

这里一共总结了软件构造的 8 个视图，我们平时在编程过程中应该谨记这几条，成为一个优秀的开发者。

# 参考资料

1. Software Construction at HIT | 1.1 Multi-Dimensional Views of Software Construction

[uml]: ../../../../2018/06/05/java-UML/
[gradle]: ../../../../2018/04/03/gradle-travis/
[ci-def]: https://www.techopedia.com/definition/4436/configuration-item-ci
