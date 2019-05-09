---
title: Windows 下 Git SSH 连接方式配置 Socks 代理
date: 2019-05-09 22:04:25
tags:
- git
- github
- socks
- gfw
categories:
- 工具
- Git
---

最近从 GitHub clone 仓库速度极慢，遂查阅资料解决之。本文主要介绍 Git 使用 SSH 克隆时如何走 Socks 代理，因为使用 HTTPS 克隆的话目前基本上很容易找到资料，比如 [Using a socks proxy with git for the http transport | Stackoverflow](https://stackoverflow.com/questions/15227130/using-a-socks-proxy-with-git-for-the-http-transport)。

<!-- more -->

正如那个回答里面所说，Git 已经对 HTTPS 方式的代理支持的很好了，设置 http 和 socks 代理都是支持的，但是如果你是使用 SSH 方式的话，就不得不另行配置了。

Stack Overflow 上有一个问题 [SSH in git behind proxy on windows 7](https://stackoverflow.com/questions/5103083/ssh-in-git-behind-proxy-on-windows-7)，提出使用 `connect` 进行代理。但是问题本身是针对 http 代理的，如果使用 socks 代理需要更改一下。

首先明确一点：`connect.exe` 已经在 Git 中预置了，无需再次下载安装。见下面的截图：

![connect.exe path](https://i.loli.net/2019/05/09/5cd4359d7ebb2.png)

然后我们创建一个 `config` 文件：

```bash
vi ~/.ssh/config
# 当然你也可以手动在 C:\Users\Username\.ssh 下创建 config 文件
```

在文件中写入如下内容：

```config
# 这里的 -a none 是 NO-AUTH 模式，参见 https://bitbucket.org/gotoh/connect/wiki/Home 中的 More detail 一节
ProxyCommand connect -S 127.0.0.1:1080 -a none %h %p

Host github.com
  User git
  Port 22
  Hostname github.com
  # 注意修改路径为你的路径
  IdentityFile "C:\Users\Doraeming\.ssh\id_rsa"
  TCPKeepAlive yes

Host ssh.github.com
  User git
  Port 443
  Hostname ssh.github.com
  # 注意修改路径为你的路径
  IdentityFile "C:\Users\Doraeming\.ssh\id_rsa"
  TCPKeepAlive yes
```

再来看看现在 `git clone` 的速度：

![Git clone ssh under socks proxy](https://i.loli.net/2019/05/09/5cd43714ed795.png)

记录一下，主要是阅读官方文档花了一些时间，希望对你有所帮助。当然，如果你是用的是 Linux 和 macOS 的话可以找到 `connect.exe` 的等价替代，Google 即可找到很多答案，比如[这一篇](https://blog.systemctl.top/2017/2017-09-28_set-proxy-for-git-and-ssh-with-socks5/)。