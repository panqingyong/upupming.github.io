---
title: 信息安全导论基础知识
tags:
  - 信息安全
categories:
  - 信息安全
date: 2018-06-27 22:22:54
---


本文记录了哈工大信息安全概论课基础知识点。

<!-- more -->

# 信息安全体系结构

## 面向目标的知识体系结构

信息安全的三个最基本目标（CIA 三元组）：机密性(Confidentiality)、完整性(Integrity)、可用性(Availability)。

<figure class=not-code>
<iframe frameborder="0" style="width:100%;height:334px;" src="https://www.draw.io/?lightbox=1&highlight=0000ff&edit=_blank&layers=1&nav=1#R7VhNc5swEP01e3QHkAFxBBunPfSUzvQsGxlripGL5a%2F%2B%2Bq6EsE3ATRo7M6nTTGYsPa2k1b59%2BgDIaLl%2FqNhq8VVmvADPyfZAxuB5rh%2B5%2BKORQ4O4YY3klcgsdgIexS9uQceiG5HxdctQSVkosWqDM1mWfKZaGKsquWubzWXRnnXFct4BHmes6KLfRaYWNUp954R%2F5iJfNDO7jm2ZstmPvJKb0s4HHpmbv7p5yZqxrP16wTK5O4NICmRUSanq0nI%2F4oUObhO2ut%2FkQuvR74qX6iUdvLrDlhUb3nhs%2FFKHJhaqEqzMdS3ZLYTijys200075B6xhVoWWHOxWEnFlJAlVgeRg0AmKmSnRjhbo0dJ10Hr85ZXiu%2FPIOvwA5dLrqoDmjStTbBtdjWx3J2YciO7jsUZSx6xSchsduTHoU8RwoINUn%2FA%2FJ6ABYVe2Vziis4jF%2FzcyKZhsDY5HqMBcVf7UyOWcvObDiGZQOxCGgB1IZ4046JH9dDWsMMP36snPHCcjU2NgaZhJUWpzJr9BPwxImyjZO2R6cAKkWuOCj7XQ2kqBIohtrCSmug18i7K%2FJuujAfDG3HpBy0uXUI%2F%2BR06qdPDpnM9mcFFMjOx7eVSB3tgw6XJnOHSedVDpx0Hg1ZekxQBRCNIYkh9nRE0MNnhQByeZUc9R3tehM0SburNm8SmxkaynOOWXyqBA6jDq1bXMb4noTRHqtXJwO9uesfT81wm5AYyCd%2B9THygEy2QNIRoCDG9V5nEWyYKNhX%2FNdKnEUKeXAz6bgbBG4mE%2FgMiiVOgI3Oo%2BJAMrxNJ%2B07y55X2OuiYjs41cviCpviAeKUW3gkvdpRp9axWnxH2%2Fd4SB8ELhE16hO3fQNgueTfKdulFZY8houYc9MzxR7Sy8RmhXxUjiB1IKSQpRKTdNNZvjvNDMwohCUwTBTrWSIL2uFVE5iLq%2FWVu3lMS0ic3sLDnBtaXg7d4qLjDq5%2Bdl3LnSDWFGHMn0ekQNw9RzIsk%2BhhbzNBv0UucLr3RW7F7%2FUeFS%2ByGmkg89uuvC5FRNMVbQC32MVDSvjPjLhH25YSvtxHcW3SB6n9tnEDk6e5Joof6CFlCXOfZLLnVJoDV03dA03b2tZWkvwE%3D"></iframe>
<caption>图一    信息安全的三个基本目标</caption>
</figure>

另外还有这些原则：可追溯性(Accountability)、抗抵赖性(Non-repudiation)、真实性(Authenticity)、可控性(Controllable)。

CIA 三元组的反面 DAD 三元组：泄露(Disclosure)、篡改（Alteration)、破坏(Destruction)。

## 面向应用的层次型技术体系结构

信息系统的基本要素从下到上依次为：

1. 系统

  + 物理安全
  + 运行安全

2. 信息

  + 数据安全
  + 内容安全

3. 人员

  + 管理安全

下层的安全为上层的安全提供保障。

## 面向过程的信息安全保障体系

包括四部分内容(PDRR)。

1. 保护(Protect)
2. 检测(Detect)
3. 反应(React)
4. 恢复(Restore)

## OSI（开放系统互连）安全体系结构

ISO 给出了 Open system interconnection 七层协议之上的信息安全体系结构，有三个维度。

1. OSI 参考模型

  物理层、链路层、网络层、传输层、会话层、表示层、应用层

2. 安全服务

  鉴别服务、访问控制、数据完整性、数据机密性、抗抵赖性

3. 安全机制

  加密、数字签名、访问控制、数据完整性、鉴别交换、业物流填充、路由控制、公证

# 密码体制的五要素(MCKED)

+ M 

  明文(Message、Plain text)空间，可能明文的有限集。

+ C

  密文(Cipher text)空间，可能密文的有限集。

+ K
  
  密钥(Key)空间，可能密钥的有限集。

+ E

  加密(Encrypt)算法，对密钥空间的任一密钥加密算法都能有效计算。

+ D

  解密(Decrypt)算法，对密钥空间的任一密钥解密算法都能有效计算。

密码体系的实际可用性：

1. D<sub>k</sub>(E<sub>k</sub>(x)) = x, x 属于 M。即能够还原信息。
2. 破译者不能在有效时间内破解密钥 k 和明文 x。

# 简单替代密码

简单替代密码有：移位密码、乘数密码、仿射密码。

1. 移位密码

  加密函数

  <center><b>E<sub>k</sub>(m) = (m + k) mod q</b></center>

  解密函数

  <center><b>D<sub>k</sub>(c) = (c - k) mod q</b></center>

  凯撒密码中 k = 3, q = 26。

2. 乘数密码

  在 gcd(k, q) = 1 的前提之下。

  加密函数

  <center><b>E<sub>k</sub>(m) = (m * k) mod q</b></center>

  解密函数

  <center><b>D<sub>k</sub>(c) = (c * k<sup>-1</sup>) mod q</b></center>

  这里 k<sup>-1</sup> 是 k 在膜 q 下的乘法逆元，即 k<sup>-1</sup> * k mod q  = 1。

  已知 k 和 q，计算 k 的乘法逆元可以采用*扩展的欧几里得算法*：

  下面以 44 模 7 的乘法逆元为例
  + Step 1
    
    44/*7* = 6 余 *2*。等价于求 2 模 7 的乘法逆元。

  + Step 2

    2/*7* = 0 余 *2*。等价于求 2 模 7 的乘法逆元。（陷入循环，使用另一种方案）

  + Step 3

    7/2 = *3* 余 1。-3 % 7 = 4 得到结果。

  44 模 7 的逆元为 4。

3. 仿射密码

  是移位密码和乘数密码的结合，密钥分别为 k<sub>1</sub>、k<sub>2</sub>。

  加密函数（先乘后加）

  <center><b>E<sub>k</sub>(m) = (m * k<sub>2</sub> + k<sub>1</sub>) mod q</b></center>

  解密函数（先减后除）

  <center><b>D<sub>k</sub>(c) = ((c- k<sub>1</sub>) * k<sub>2</sub><sup>-1</sup> ) mod q</b></center>

# 数据加密标准 DSE 的算法结构和特点

Data Encryption Standard 密码算法是一种对称密钥密码。

## S-DES

Simplified DES 加密算法输入 8 位明文、10 位密钥，输出 8 位密文（都是二进制）。算法涉及 8 个函数。

> TODO

## DES 算法

一种对二进制数据进行分组加密的算法。以 64 位为分组对数据进行加密，密钥长度也是 64 位，但只有56 位有效，每个字节的第 8 位用作奇偶校验。

+ 加密算法和解密算法非常相似，唯一的区别在于子密钥的使用顺序正好相反。

+ 密码体制是公开的，所以系统的安全性完全依赖密钥保密性。

1. 初始置换 IP、分为左右两组
2. 16 轮迭代变化(16 个子密钥由 56 位有效密钥循环移位和置换生成)
3. 左右两部分连接、初始逆置换 IP<sup>-1</sup>

# 公钥密码的思想

公开密钥密码是 1976 年 Whitfield Diffie 和 Martin Hellman 在《密码学新方向》中提出的。

*单向陷门函数 f(x)*：

1. 单向性

  给定 x，计算 y = f(x) 容易

2. 单向性

  给定 y，计算 x = f<sup>-1</sup>(x) 困难

3. 陷门性

  存在 $\delta$（陷门信息），已知 $\delta$ 时计算 x = f<sup>-1</sup>(x) 容易

f 的设计者可以将陷门函数 f 公开，这相当于*公开加密密钥 P<sub>k</sub>*，将 $\delta$ 保密用作解密密钥，此时 $\delta$ 称为*秘密密钥 S<sub>k</sub>*。任何人都可以用公开加密密钥 P<sub>k</sub> 加密并发送给函数设计者，只有函数设计者知道秘密密钥 S<sub>k</sub>，所以只有他能解密。

很明显，公开密钥密码可用于解密（机密性）、验证对方身份（可认证性）。

# Diffie-Hellman 密钥交换算法

## 原根

素数 p 的原根(primitive root)：

$$a\ mod\ p,\ a^2\ mod\ p,\ ...,\ a^{p - 1}\ mod\ p$$

是不同且恰为 1 到 (p - 1) 的所有整数的一个排列，则 a 是素数 p 的原根。

## 离散对数

a 是素数 p 的原根，任意一个 b 如果 $b\ mod\ p \ne 0$，则必然存在 $i \in [1, p-1]$，使得 $b\ \equiv\ a^i\ mod\ p$。这样的 i 称为 b 的以 a 为基数且模 p 的幂指数，即离散对数。

离散对数的求解为数学界公认的困难问题。

## Diffie-Hellman 密钥交换算法

基于有限域中的计算离散对数的困难性问题而设计出来。

Alice 和 Bob 协商好一个大素数 p 和大整数 $g \in (1, p)$，g 是 p 的原根。p、g无需保密。Alice 和 Bob 通信步骤如下：

1. Alice 选取较大随机数 x < p，计算 $Y = g^x\ mod\ p$。
2. Bob 选取较大随机数 x' < p，计算 $Y' = g^{x'}\ mod\ p$。
3. Alice 将 Y 传送给 Bob，Bob 将 Y' 传送给 Alice。
4. Alice 计算 $K = (Y')^x\ mod\ P$，Bob 计算$K' = (Y)^{x'}\ mod\ P$。

显而易见 $K = K' = g^{xx'}\ mod\ P$，两人继续以相同的密钥 K 进行通信。

安全性：第三方无法由 Y、Y' 推断出 x、x'（离散对数求解的困难性），因此无法破译出 K。

# RSA 公钥算法

## 欧拉定理

n 的完全余数集合 $Z_n = \\{m | m < n 且 m与n互素 \\}$。

欧拉函数
$$ f(n) = |Z_n| $$
即 $Z_n$中元素个数。

定义 f(1) = 1。

对于素数 p、q，n = pq，则 f(n) = (p-1)(q-1)。

欧拉定理：若 a 与 n 互素，则 $a^{f(n)} \equiv 1\ mod\ n$。

推论：素数p、q，两个整数m、n，使得 n = pq，且 0 < m < n，对于任意整数 k 有：

$$ m^{kf(n) + 1} = m^{k(p-1)(q-1)+1} \equiv m\ mod\ n$$

## 大整数因子分解

已知 p、q 两个大素数，求解 N = pq 是容易的。但已知 N 是两个大素数之积，求解这两个大素数是困难的。

## RSA 密码算法

RSA 密钥体制是一组分组密码，明文和密文均是 0 到 n 之间的整数，n 的大小通常为 1024 位二进制数或 309 位十进制数。

明文空间 M = 密文空间 C = 

$$ \{x \in Z | 0 < x < n, Z 为整数集合\} $$

RSA 的密钥生成步骤：

1. 选择两个互异大整数 p、q，计算 n = pq，$\phi(n) = (p - 1)(q -1)$。

2. 选择整数 e，使 $gcd(\phi(n), e) = 1$，且 $1 < e < \phi(n)$。

3. 计算 d，使 $ d \equiv e^{-1}\ mod\ \phi(n)$，即 d 为模 $\phi(n)$ 下 e 的乘法逆元。

公开密钥 $P_k = \\{e, n\\}$，秘密密钥 $ S_k = \\{d, n, p, q\\}$。

明文为 m， 密文为 c。加密算法 $ c = m^e\ mod\ n$，解密算法 $ m = c^d\ mod\ n$。

RSA 算法的有效性：

m 加解密之后为 $(m^e)^d = m^{ed} = m^{k\phi(n)+1} \equiv m\ mod\ n$（最后一步应用了欧拉定理的推论），故算法有效。

例子

$p = 101, q = 113, n = pq = 11413, \phi(n) = (p-1)(q-1) = 11200, e = 3533, d = (e^{-1}\ mod\ 11200) = 6597$

Alice 根据 Bob 公开的密钥 n = 11413 和 e = 3533，计算出明文 9726 的密文为 $ 9726^{3533}\ mod\ 11413 = 5761$，Bob 接收到密文 5761 之后使用解密指数 d = 6597 进行解密，计算 $5761^{6597}(mod\ 11413) = 9726$。

# EMI、EMC、防电磁泄露主要方法

电磁干扰(Electro Magnetic Interference, EMI)指一切与有用信号无关的、不希望有的或对电器及电子设备产生不良影响的电磁发射。

电磁兼容性(Electro Magnetic Compatibility, EMC)指电子设备在自己正常工作时产生的电磁环境，与其他电子设备之间相互不影响的电磁特性。

常见的防电磁泄露方法有三种：
1. 屏蔽法

  屏蔽辐射及干扰信号。

2. 频域法

  利用系统的频率特性将需要的频率成分加以接受，而将干扰的频率加以剔除。

3. 时域法

  采用时间回避法回避某段时间内非常强的干扰信号。

# 容错与容灾的概念及主要技术方法

## 容错

属于常用的对错误进行处理的三条：避错、纠错、容错。

即使出现了失误，系统也可以执行一组规定的程序，程序不因为系统中的故障而中断或被修改，而且也不会运行出错误结果。（抵抗错误）

常用技术：

1. 空闲设备（两台设备随时替补）
2. 镜像（分工）
3. 复现（辅助系统较主系统延迟）
4. 负载均衡（多个子任务）

## 容灾

对偶然事故（天灾人祸）的预防和恢复。

常用技术：

1. 做最坏的打算
2. 充分利用现有资源
3. 既重视灾后恢复也重视灾前措施

# Windows 网络认证

<figure class=not-code>
<img src=windows-network-authentication.jpg>
<caption>图二 Windows 安全认证（来自哈工大信息安全概论）</caption>
</figure>

|客户端|主域控制器|
|:--:|:--:|
|输入用户名、密码，请求登录||
||发送 8 字节质询|
|返回质询散列||
||对比结果相同，登录成功 <br> 否则登录失败|

# 利用公开密钥和对称密钥设计认证协议获得会话密钥

## Needham-Schroeder 认证协议

每个使用者在认证服务器(Authentication Server, AS)上注册，AS 保存每个用户的信息并与每一个用户共享一个对称密钥。KDC 为 AS 的密钥分配中心，负责分配 $K_s$。A, B 与 AS 之间的共享密钥分别为 $K_a, K_b$。

1. $ A \to KDC:\ ID_A || ID_B || N_1 $

  A 通知 KDC 要与 B 进行安全通信。$N_1$ 为临时值，$ID_A, ID_B$ 分别是 A, B 的网络用户标识。

2. $ KDC \to A: E\_{K\_a}[K\_s || ID\_B || N\_1 || E\_{K\_b}[K\_s || ID\_A]] $

3. $ A \to B: E\_{K\_b}[K\_s || ID\_A] $

  A 转发 KDC 给 B 的内容，此内容只有 B 和 AS 能够还原。

4. $ B \to A: E_{K_s}[N_2] $

  B 用 $K_s$ 加密挑战值 $ N_2 $，发给 A 并等待 A 的回应认证消息。

5. $ A \to B: E_{K_s}[f(N_2)] $

  A 还原 $ N_2 $ 之后，根据事先的约定 $f(x)$，计算 $f(N_2)$，使用 $K_s$ 加密后，回应 B 的挑战，完成认证，随后 A 和 B 使用 $K_s$ 进行加密通信。

# Kerberos 工作原理

通过对称密钥系统为客户机和服务器提供强大的第三方认证服务。

第一阶段：完成身份认证，获得访问 TGS 的票据

1. 请求 TGS 票据

2. 返回 TGS 票据

第二阶段：获得访问应用服务器的票据

3. 请求应用服务器票据

4. 返回应用服务器票据

第三阶段：获得服务

5. 向应用服务器发起服务请求

6. 服务器对客户机的身份验证

# PKI 的体系结构及工作原理

## PKI 体系结构

公钥基础设施(Public Key Infrastructure, PKI)是一种密钥管理基础平台，为所有网络应用提供加密和数字签名等密码服务所必需的密钥和数字证书。

1. 认证机构 CA
2. 证书库
3. 密钥备份及恢复
4. 证书撤销处理
5. PKI 应用接口

## PKI 工作原理

> TODO

# 访问控制的概念

访问控制(Access control)技术是用来管理用户对系统资源的访问的。访问控制基本组成元素主要包括：主体(Subject, 提出访问请求的实体)、客体(Object, 接受主体访问的实体)、访问控制策略(Access Control Policy, 主体对客体操作行为和约束条件的关联集合，决定主体是否有权进行相关操作)

# DAC、MAC、RBAC 工作原理及特点

## 自主访问控制模型(Discretionary Access Control Model, DAC Model)

特权用户为普通用户分配访问权限。

特点：数据访问方式灵活，授权主体可赋予或收回其他主体的访问权限，因此 DAC 广泛应用于商业和工业环境中。

## 强制访问控制模型(Mandatory Access Control Model, MAC Model)

多级访问控制策略，系统事先给给主体和客体赋予不同的*安全级别属性*，在实施访问控制时系统先对访问主体和受控客体的安全级别属性进行比较，再决定访问主体能否访问该受控客体。

依靠不同实体安全级别之间存在的偏序关系，主体对客体的访问可以分为四种形式：
1. 向下读
  
  主体安全级别高（于客体），允许读

2. 向上读

  主体安全级别低，允许读

3. 向下写

  主体安全级别高，允许写

4. 向上写

  主体安全级别低，允许写

## 基于角色的访问控制模型(Role Based Access Control, RBAC)

引入组和角色的概念。角色作为一个用户与权限的代理层，所有的授权应该给予角色而不是直接给用户或组。RBAC 模型的基本思想是将访问权限分配给一定的角色，用户通过饰演不同的角色获得角色所拥有的访问许可权。


访问控制策略总结起来都围绕着三点：主体、客体、操作权限。需要遵循三个最基本的原则。

1. 最小特权原则
2. 最小泄露原则
3. 多级安全策略

# Windows 安全体系结构、活动目录与组策略

## 安全体系结构

1. 最外层：用户认证
2. 加密和访问控制
3. 内核：管理和审计
4. 核心：安全策略

## 活动目录(Active Directory, AD)和组策略(Group Policy, GP)

两者协调工作。

AD 是面向 Server 的目录服务，存储有关网络对象(包括用户、用户组、计算机、打印机、应用服务器、域、组织单元、安全策略等)的信息，管理员和用户可查找。

GP 可以将系统重要配置功能集合起来，管理人员配置并实施 GP，实际上是在改变注册表，但是更加方便快捷。

# 传统病毒、蠕虫、木马的结构原理

## 传统病毒

三个模块：启动模块、传染模块、破坏模块

例子：CIH 病毒

## 蠕虫病毒

特点：无需寄生，以互联网为传染途径，往往能够利用漏洞（软件漏洞、人为因素）。

## 木马

特点：隐蔽性、传染性，主要以控制计算机为目的。

例子：盗号、增加网页点击量、伪装下载文件、恶意开启代理。灰鸽子

组成部分：控制端程序（客户端，黑客那里）、木马程序（服务器端，受害者那里）、木马配置程序。

# 拒绝服务攻击、缓冲区溢出

## 拒绝服务攻击

1. Ping of Death

  TCP/IP 规定包长度最大为 65536 字节。利用多个 IP 包分片构造特殊 IP 数据包合起来超出 65536 字节，致使接收到的操作系统出现内存分配错误。

2. Tear drop

  两个 IP 分片包出现偏移重叠时系统无法正确处理，出现内存分配错误。

3. Syn Flood

  用来攻击开放了 TCP 端口的服务器。TCP 是双向验证的协议，如果客户端请求访问发送了 SYN 报文，服务器会回以 SYN ACK 报文，客户端本应继续回复 ACK 报文确定连接正常建立。攻击者不发送者第三个报文，服务器就会存在一定的等待时间，在这段时间里面分配了给客户端使用的内存。如果黑客使用大量的这种攻击，服务器将会耗尽自己的资源。

4. Smurf

  构造以受害主机 A 的主机地址为源地址的 ICMP ECHO 请求包发送给广播地址。收到请求包的网络主机纷纷回应 A，造成 A 瘫痪。

5. 电子邮件炸弹

## 缓冲区溢出

这个太常见了，平时在编程中可能会存在一些漏洞使得黑客可以利用它们执行非法指令。多以某些特定输入使缓冲栈溢出，CPU call 到溢出的部分，运行非法指令。

# 防火墙主要技术概述

防火墙依据技术特征可划分为：包过滤防火墙、代理防火墙、个人防火墙。

## 包过滤防火墙

面向网络底层数据流进行审计和管控。安全策略主要包括：包头的源地址、目的地址、端口号、协议类型。

## 代理防火墙

基于代理技术，类比我曾写过的 Java 设计模式中的代理模式，能够较好地隔离客户端与服务器。

## 个人防火墙

软件类防火墙，成本较低，易于控制。

主要技术：ACL、静态包过滤、动态包过滤、应用级网关、电路级网关、NAT、VPN 等等。

# Netfilter/iptables 工作原理

Netfilter 是嵌入在 Linux 内核 IP 协议栈中的一个通用架构。它提供一系列的表(Tables)，每个表由若干链(Chains)组成。每条链由若干规则(Rule)组成。

三个功能表：

+ 数据包过滤表(Filter)

  决定放行或拦截

  包含 Input（本地数据包）、Forward（转发给别人的数据包）、Output（本地产生的数据包） 三个链

+ 网络地址转换表(NAT)

  网络地址转换  

+ 数据包处理表(Mangle)

  提供修改数据包某些字段值的方法

包过滤表中的规则通过 IPtables 命令管理，每条 IPtables 命令由五个基本部分组成

**<center>IPtables 命令 = 工作表 + 使用链 + 规则操作 + 目标动作 + 匹配条件</center>**

可见前三项恰是 Netfilter 的三级结构，后两项才是具体命令和匹配的条件。

# 基于主机和基于网络的入侵检测系统的优缺点

## 主机型入侵检测系统(Host-based Intrusion Detection System, HIDS)

通过分析系统的审计数据来发现可疑活动。

只能用来检测内部授权人员的误用以及成功避开传统的系统保护方法而渗透到网络内部的入侵活动，检测准确性较高，及时性好。

优势：性价比高、无需专门硬件、准确率高、实时性好、对网络流量不敏感、适合加密环境下的入侵检测。

缺点：与操作系统平台相关，可移植性差、需要每个被检测主机单独安装、难以检测针对网络的攻击（DoS、端口扫描）。

## 网络型入侵检测系统(Network-based Intrusion Detection System, NIDS)

通过部署在网络关键位置的感应器捕获数据包，分析是否有入侵迹象。发现可疑时向中心管理站点发出警报信息。

优点：用户透明、隐蔽性好、使用简便、平台无关、不给业务主机造成负担、攻击者不易转移证据。

缺点：无法检测内部攻击和误用、无法分析所传输的加密数据报文、对所有网络报文进行采集，负荷较大、易受 DoS 攻击。

HIDS 和 NIDS 具有互补性。

# Snort 工作原理

Snort入侵检测系统是一个开放源代码的轻量级网络入侵检测系统。
Snort遵循CIDF模型，使用误用检测的方法来识别发现违反系统和网络安全策略的网络行为。
Snort系统包括数据包捕获模块、预处理模块、检测引擎和输出模块四部分组。

<figure class=not-code>
<img src=snort.png>
<caption>图三 Snort 的捕获、预处理、检测、输出（来自哈工大信息安全概论）</caption>
</figure>

Snort将所有已知的入侵行为以规则的形式存放在规则库中，并以三维链表结构进行组织。

规则头由规则行为、协议字段、地址和端口信息3部分组成。Snort定义了五种可选的行为：

+ Alert：使用设定的警告方法生成警告信息，并记录这个数据报文。

+ Log：使用设定的记录方法来记录这个数据报文。

+ Pass：忽略这个数据报文。

+ Activate：进行alert，然后激活另一个dynamic规则。

+ Dynamic：等待被一个activate规则激活，被激活后就作为一条log规则执行。

# IPSec 协议的体系结构

两个基本协议：有效负荷(Encapsulating Security Payload, ESP)协议和认证头(Authentication Header, AH)协议。

四个要件：加密算法、认证算法、解释域(Domain of Interpretation, DOI)、密钥管理。

# 传输方式和隧道方式的区别

在传输模式(Transport Mode)下，AH 和 ESP 主要对上一层的协议提供保护；在隧道模式(Tunnel Mode)下，AH 和 ESP 则用于封装整个 IP 数据报文。

传输模式只是对 IP 数据包的有效负载进行加密或认证。只在原有 IP 头和数据之间插入新的 IPSec 头。

隧道模式对整个 IP 数据包进行加密或认证，需要新产生一个 IP 头部，并将 IPSec 头放在新 IP 头和原始 IP 头之间。这样就组成了一个新的 IP 头。

# SSL 握手协议

SSL 协议族包括 SSL 记录协议(SSL Record Protocol，处于传输层与应用层之间)、SSL 握手协议 (SSL Handshake Protocol)、SSL 转换密码规范协议(SSL Change Cipher Spec Protocol)、SSL 报警协议(SSL Alert Protocol)。后三个协议均为应用层协议。

握手协议最为复杂、核心。

1. 建立安全能力

  > TODO

2. 服务器认证与密钥交换

3. 客户端认证与密钥交换

4. 结束

# 双签名技术原理

围绕顾客、商家、银行之间欺诈情况进行双重签名(DUal Signature, DS)，将 OI(Order Information) 和支付信息(Payment Information)的摘要信息绑定在一起，确保电子交易的有效性和公正性。同时分离 PI 和 OI，确保商家不知道顾客的支付卡信息，银行不知道顾客的订购细节。

# DMR 结构原理

数字版权保护技术(Digital Rights Management)以一定算法保护数字内容，防止非法复制。

主要技术：数字标识技术、安全和加密技术、安全存储技术。

主要方法：数字水印、数据加密和防复制。

DRM 系统分为服务器和客户端两个部分，DRM 服务器主要管理版权文件的授权和分发，DRM 客户端的主要依据受版权保护的文件提供的信息申请授权许可证，并依据授权许可信息解密受保护文件，提供给用户使用。(类似 Windows 联网激活)

# 数字水印原理

三个基本方面：水印的形成、嵌入（分析、选择嵌入点）和检测（检测是否存在、提取水印信息）。

不破坏原始作品，具有以下特征：

1. 隐蔽性
2. 鲁棒性
3. 安全性
4. 易用性

# CC 与 BS 7799 的区别

## 信息技术安全性评估通用准则(CC)

提倡工程安全，通过开发、评价、使用全过程各个环节综合考虑产品的安全性。

结构上三部分：简介和一般模型、安全功能要求、安全保证要求。

## 信息安全管理体系标准(BS 7799)

1. 7799-1

  133 项安全控制

2. 7799-2

  建立、实施、维护信息安全管理体系的要求，建立企业所需

# 参考资料

1. 翟建宏. 张宏莉. 信息安全导论. 科学出版社. ISBN 978-7-03-031754-4
