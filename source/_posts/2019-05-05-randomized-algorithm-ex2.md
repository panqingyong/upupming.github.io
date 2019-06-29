---
title: 随机算法作业 2
tags:
  - randomized algorithm
categories:
  - 算法
  - 随机算法
date: 2019-05-05 00:52:38
---


随机算法作业 2，主要是『球和箱子模型』的相关题目。

<!-- more -->

## 2.1

![习题 2.1](https://i.loli.net/2019/04/07/5ca9bd722ae98.png)

### 两两独立

只需证明

$$
P(X_{ij}=x_1 \cap X_{kl} = x_2) = P(X_{ij}=x_1) \cdot P(X_{kl} = x_2), i < j, k < l， 当k =i 和 l = j 不同时成立
\tag{1}
$$

根据已知条件，各次投掷之间是【相互独立】的，用 $X_i$ 表示第 $i$ 次的投掷结果（0 为反面，1 为正面）

$$
P(X_i \cap \cdots \cap X_j) = P(X_i) \cdot  \cdots \cdot P(X_j)
$$

证明：

先证明 $i, j, k, l$ 都不相等的情况：

$$
\begin{aligned}
P(X_{ij}=x_1 \cap X_{kl} = x_2)
&= P[(X_i \oplus X_j = 1 - x_1)\cap (X_k \oplus X_l = 1 - x_2)] \\
&= \sum_{x_i=0,1;x_k=0,1} P\{X_i = x_i \cap X_j = [(1-x_1) \oplus x_i] \cap X_k = x_k \cap X_l = [(1-x_2) \oplus x_k]\} \\
&\xlongequal{相互独立} \sum_{x_i=0,1;x_k=0,1} P(X_i = x_i) \cdot P\{X_j = [(1-x_1) \oplus x_i]\} \cdot P(X_k = x_k) \cdot P\{X_l = [(1-x_2) \oplus x_k]\} \\
&\xlongequal{两两独立} \sum_{x_i=0,1;x_k=0,1} P\{X_i = x_i \cap X_j = [(1-x_1) \oplus x_i]\} \cdot P\{X_k = x_k \cap X_l = [(1-x_2) \oplus x_k]\} \\
&\xlongequal{去除求和符号中的无关项} \left\{\sum_{x_i=0,1} P\{X_i = x_i \cap X_j = [(1-x_1) \oplus x_i]\}\right\} \cdot \\ & \quad \quad \quad \quad \quad \quad \quad \quad \quad \quad \quad \left\{\sum_{x_k=0,1} P\{X_k = x_k \cap X_l = [(1-x_2) \oplus x_k]\}\right\} \\
&=  P(X_{ij}=x_1) \cdot P(X_{kl} = x_2)
\end{aligned}
$$

下面考虑特殊情况，

1. 如果 $k=j$，证明过程中可以消掉 $X_j$ 项，证明过程如下：

    $$
    \begin{aligned}
    P(X_{ij}=x_1 \cap X_{kl} = x_2)
    &= P[(X_i \oplus X_k = 1 - x_1)\cap (X_k \oplus X_l = 1 - x_2)] \\
    &= \sum_{x_i=0,1;x_k=0,1} P\{X_i = x_i \cap X_k = [(1-x_1) \oplus x_i] \cap X_k = x_k \cap X_l = [(1-x_2) \oplus x_k]\} \\
    &= \sum_{x_i=0,1;x_k=[(1-x_1) \oplus x_i]} P\{X_i = x_i \cap X_k = x_k \cap X_l = [(1-x_2) \oplus x_k]\} \\
    &\xlongequal{相互独立} \sum_{x_i=0,1;x_k=[(1-x_1) \oplus x_i]} P(X_i = x_i) \cdot P(X_k = x_k) \cdot P\{X_l = [(1-x_2) \oplus x_k]\} \\
    &\xlongequal{运用无偏条件}\sum_{x_i=0,1;x_k=[(1-x_1) \oplus x_i]} \frac{1}{2} \frac{1}{2} \frac{1}{2} \\
    &= \frac{1}{4}
    \tag{2}
    \end{aligned}
    $$
    再从 $P(X_{ij}=x_1) \cdot P(X_{kl} = x_2)$ 开始推导一下
    $$
    \begin{aligned}
    P(X_{ij}=x_1) \cdot P(X_{kl} = x_2)
    &= P(X_{ik}=x_1) \cdot P(X_{kl} = x_2) \\
    &= P[(X_i \oplus X_k = 1 - x_1)] \cdot P[(X_k \oplus X_l = 1 - x_2)] \\
    &= \sum_{x_k=0,1} \left\{P\left\{X_k = x_k \cap X_i = [(1-x_1) \oplus x_k]\right\}\right\} \cdot \sum_{x_k=0,1}\left\{P\left\{X_k = x_k \cap X_l = [(1-x_2) \oplus x_k]\right\}\right\} \\
    &= \sum_{x_k=0,1,x_s=0,1} \left\{P\left\{X_k = x_k \cap X_i = [(1-x_1) \oplus x_k]\right\} P\left\{X_k = x_s \cap X_l = [(1-x_2) \oplus x_s]\right\} \right\} \\
    &= \sum_{x_k=0,1,x_s=0,1} \left\{P(X_k = x_k) \cdot P(X_i = [(1-x_1) \oplus x_k]) \cdot P(X_k = x_s) \cdot P(X_l = [(1-x_2) \oplus x_s]) \right\} \\
    &\xlongequal{运用无偏条件} \sum_{x_k=0,1,x_s=0,1} \left\{\frac{1}{2} \cdot \frac{1}{2} \cdot \frac{1}{2} \cdot \frac{1}{2} \right\} \\
    &= \frac{1}{4}
    \tag{3}
    \end{aligned}
    $$
    得到式 $(2)$ 和 式 $(3)$ 相等。

2. 如果 $k=i$，证明是类似的。
3. 如果 $l=j$，证明是类似的。

综上所述，$(1)$ 式成立，即 $X_{ij}$ 之间两两独立。

### 不相互独立

这很显然，因为 $X_{13}$ 是完全依赖于 $X_{12}$ 和 $X_{23}$ 的。

$$
\begin{aligned}
P(X_{13}=1)
&= P(X_1 = X_3) \\
&= P[(X_1 = X_2) \cap (X_2 = X_3)] + P[(X_1 \neq X_2) \cap (X_2 \neq X_3)] \\
&= P(X_{12}=1\cap X_{23}=1) + P(X_{12}=0\cap X_{23}=0) \\
&\xlongequal{X_{ij} 之间的独立关系} P(X_{12}=1)P(X_{23}=1) + P(X_{12}=0)P(X_{23}=0)
\end{aligned}
$$

也就是说，

$$
\begin{aligned}
P(X_{12}=1,X_{23}=1,X_{13}=1)
&= P(X_{12}=1,X_{23}=1)  \\
&= P(X_{12}=1)\cdot P(X_{23}=1) \\
&\neq P(X_{12}=1)\cdot P(X_{23}=1) \cdot P(X_{13}=1)
\end{aligned}
$$

故相互独立不成立。

## 2.2

![习题 2.2](https://i.loli.net/2019/04/07/5ca9d24aa97f6.png)

> 有一个很类似的题《概率与计算》习题 5.8，可以看一下，原题与答案如下：
<!-- > <embed src="https://drive.google.upupming.site/viewerng/viewer?embedded=true&url=http://cjluserv.iis.sinica.edu.tw/~josephcclin/research/randalg/exercises/exercise5.pdf" width=800px height=1100px> -->

题目中的【两两独立】必须改为【相互独立】，不然无法证明，下面在相互独立的条件下进行证明。

相比于课堂上所讲的，这里的唯一变化是输入值的值域从 $[0, 1)$ 变为了 $[0, 2^k)$。我么只需把 $[0, 2^k)$ 映射到课堂上所讲的 $[0, 1)$ 即可。

1. 初始化 $n$ 个桶，编号介于 $[0, n-1)$ 之间；
2. 扫描输入，将数值 $A[i]$ 放入编号为 $\lfloor n\frac{A[i]}{2^k} \rfloor$ 的桶中；
3. 将各个桶内的数据各自排列；
4. 依编号递增顺序输出各个桶内的数据。

### 时间复杂度分析

散列过程可以视为将 $n$ 个球投入 $n$ 个箱子中，设 $X_i$ 表示箱子 $i$ 中的球的数量，由各个数的选取是相互独立的，均匀分布在 $[0, 2^k)$ 内，并且式子 $\lfloor n\frac{A[i]}{2^k} \rfloor$ 将产生  $[0, 2^k)$ 到 $[0, n)$ 的均匀映射，得到 $X_i$ 服从参数为 $(n, \frac{1}{n})$ 的二项分布，各 $X_i$ 不独立。

由二项分布的结论

均值
$$
E(X_i) = np = 1
$$
方差
$$
D(X_i) = np(1-p) = 1-\frac{1}{n}
$$
进而
$$
\begin{aligned}
E(X_i^2)
&= D(X_i) + E^2(X_i) \\
&= 2-\frac{1}{n}
\end{aligned}
$$
在每个桶内，对所有元素进行 InsertSort 所需的最坏时间复杂度为 $O(\frac{X_i^2}{2})$，期望为 $O[E(\frac{X_i^2}{2})] = O[\frac{1}{2}E(X_i^2)]$。

总时间复杂度期望为

$$
\begin{aligned}
E[T(n)]
&= \sum_{i=1}^nO[\frac{1}{2}E(X_i^2)] \\
&= O[\frac{n}{2}(2-\frac{1}{n})] \\
&= O(n - \frac{1}{2}) \\
&= O(n)
\end{aligned}
$$

## 2.3

![习题 2.3](https://i.loli.net/2019/04/07/5ca9e53cbeb6e.png)

这是一个生日悖论问题，假设某个省的总人数为 $P$，$k$ 位 $[0,9)$ 之间的数能够表示 $10^k$ 不同的编号，再加上中间 8 位生日，不妨以 100 年来计算，一共有 $100 \times 365 = 36,500$ 种情况，每个人的生日是均匀独立地分布的，$k$ 位数字也是随机选取的，所以每个编号都是独立等可能地被选取，符合生日悖论的条件。

给省里的每一个人编一个号，也就是说有 $m = P$ 个球，要放入 $n = 36,500 \times 10^k$ 个箱子中，要保证【没有两个人有同一个身份证号】的概率至少为 99%，根据生日悖论，有：

$$
e^{-\frac{m^2}{2n}} \ge 0.99
$$

解得：

$$
\begin{aligned}
n &\ge \frac{m^2}{2\ln \frac{1}{0.99}} \\
10^k &\ge \frac{P^2}{73000\ln \frac{1}{0.99}} \\
\end{aligned}
$$

我们取哈尔滨的总人口 [955 万](http://www.chamiji.com/201807177546.html) 来进行计算得到：

$$
10^k \ge 1.24309 \times 10^{11}
$$

所以 k 的取值为 12 才行。

这里的 k 明显大于实际情况中的取值 4，这是因为现实生活中身份证编号的最后 4 位不是随机生成的，而是对于同年同日出生的情况，不再使用已经生成过的编号。

> 还有一种思路是按照每个地区每天的出生人口来算，这样就不用管中间 8 位生日了。

## 2.4

![习题 2.4](https://i.loli.net/2019/04/07/5ca9f355af7d1.png)

(1)

第 i 次 Insert(x) 需要探查的存储位置个数为随机变量 $X_i$，

$$
\begin{aligned}
P(X_i=a)
&= P\{A[h(x,0)]\neq NULL \land \cdots \\ &\quad \land A[h(x,a-1)]\neq NULL \land A[h(x,a)]= NULL\}
\end{aligned}

\tag{1}
$$

因为共有 $i-1$ 个数据项，$h$ 均匀独立，且总共有 $2n$ 种取值，那么：

$$
P\{A[h(x,i)]\neq NULL\} = \frac{i-1}{2n}
$$

再由独立性，得到：

$$
\begin{aligned}
P(X_i=a) 
&= \left(\frac{i-1}{2n}\right)^{a-1}\left(1-\frac{i-1}{2n}\right) \\
&= (i-1)^{a-1}(2n-i+1)\left(\frac{1}{n}\right)^a\left(\frac{1}{2}\right)^a
\end{aligned}
$$

只需证明：

$$
(i-1)^{a-1}(2n-i+1)\left(\frac{1}{n}\right)^a \le 1
$$

左边对 $i$ 求导得到：
$$
\left(\frac{1}{n}\right)^a\left(\left(a-1\right)\left(2n-i+1\right)\left(i-1\right)^{a-2}-\left(i-1\right)^{a-1}\right)\quad > 0
$$

也就是说 $P(X_1=a)\le P(X_2=a)\le \cdots \le P(X_n=a) = \left(\frac{n-1}{2n}\right)^{a-1}-\left(\frac{n-1}{2n}\right)^a \le \left(\frac{1}{2}\right)^{a-1}-\left(\frac{1}{2}\right)^{a}=\left(\frac{1}{2}\right)^{a}$

> 最后一步放缩需要用到 $f(x) = x^{a-1} - x^a$ 的导数为 $-x^{a-2}\left(ax-a+1\right)$，令其大于 0 得 $x < 1-\frac{1}{a}$，注意有一个特例是 $P(X_1=1)=1$，不满足上式。只要 $a \ge 2$，上式一定成立。

(2)

利用上一问的结论，同时还需认识到 $P(X_i >2\log n) \le P(X_i =\lfloor 2\log n\rfloor)$，这是因为有下式成立：

$$
\left(\frac{i-1}{2n}\right)^{a}-\left(\frac{i-1}{2n}\right)^{a+1} + \left(\frac{i-1}{2n}\right)^{a+1}-\left(\frac{i-1}{2n}\right)^{a+2} + \cdots \le \left(\frac{i-1}{2n}\right)^{a-1}-\left(\frac{i-1}{2n}\right)^a
$$

也就是说 $X_i=a+1, a+2, \cdots,  a+3, \cdots$ 的概率之和小于等于 $X_i=a$ 的概率。

$$
\begin{aligned}
P(X_i >2\log n)
&\le P(X_i =\lfloor 2\log n\rfloor) \\
&\le (\frac{1}{2})^{2\log n} \\
&= (\frac{1}{2^{\log n}})^2 \\
&\xlongequal{默认底数为 2} \frac{1}{n^2}
\end{aligned}
$$

(3)

$$
\begin{aligned}
P(X >2\log n)
&= P(\max_{i}X_i >2\log n) \\
&= P( \exists X_i, X_i >2\log n) \\
&= P(X_1 > 2 \log n \lor X_2 > 2 \log n \lor \cdots \lor X_n > 2 \log n) \\
&\le P(X_1>2\log n) + P(X_2>2\log n) + \cdots + P(X_n>2\log n) \\
&\le n \cdot \frac{1}{n^2} = \frac{1}{n}
\end{aligned}
$$

(4)

$$
\begin{aligned}
E(X)
&= \sum_{i=1}^{n} P(X=i)\cdot i \\
&\xlongequal{i=\lceil2\log n\rceil} \sum_{i=1}^{n} P(X=\lceil2\log n\rceil)\cdot \lceil2\log n\rceil \\
&\le \sum_{i=1}^{n} P(X>2\log n)\cdot \lceil2\log n\rceil \\
&\le n \cdot \frac{1}{n} \cdot 2 \log n \\
&= O(\log n)
\end{aligned}
$$

## 2.5

<img src="https://i.loli.net/2019/04/07/5caa167038f1a.jpg" alt="习题 2.5">

> 更新：用 LSH 评判集合相似性，可以达到 $n \ln n$ 的复杂度。

听众相当于箱子，歌曲相当于球，每个球可以被扔进多个箱子，如果箱子之间相似球的个数越多，那么证明箱子越『口味趋于相同』。

### 位运算算法

为每一个听众分配 m 位二进制数，第 i 位表示第 i 首歌曲是否在听众的歌曲列表里（在为 1，不在为 0），两两之间做逻辑与运算，将得到的结果（做与运算后1的个数）存放在对角矩阵中，进行排序。最后按递减排序输出听众对和共同喜欢的歌曲总数即可。

维护一个三角矩阵 $A$，$A_{ij}$ 表示听众 $i$ 和听众 $j$ 所共同喜欢的歌曲的数量，令 $A_{ii} = 0$。对矩阵元素进行排序即可。

空间复杂度：二进制数加上对角矩阵为 $O(n+n^2)=O(n^2)$。时间复杂度上，因为不仅双层循环遍历所有听众，需要时间为 $O(n^2)$，还要对 $\frac{n^2}{2}$ 个元素进行排序，时间为 $O(n^2\log n)$，效率非常低下。

### 双射问题

课堂上所讲的生日悖论、赠券收集分别是单射和满射，这里我们分析的是双射问题。

我们记 $X_{ij}$ 为听众 $i$ 是否喜欢歌曲 $j$，喜欢表示为 1，不喜欢表示为 0。

我们的目的是寻找 $Y_{i_1i_2} = \sum_jX_{i_1j}X_{i_2j}$ 最大的 $i_1, i_2$，或者说将所有 $Y_{i_1i_2}$ 降序输出。

假设：每名听众喜欢的歌曲数量是随机的，喜欢哪些歌曲也是随机选取的。

那么 $X_{i_1j}$ 和 $X_{i_2j}$ 就是相互独立的，且

$$
E(X_{i_1j}) = \frac{1}{2} \cdot 1 + \frac{1}{2} \cdot 0 = \frac{1}{2}
$$
那么
$$
E(X_{i_1j}X_{i_2j}) = E(X_{i_1j})E(X_{i_2j}) = \frac{1}{4}
$$

$$
E(\sum_jX_{i_1j}X_{i_2j}) = \frac{m}{4}
$$

根据上面这个式子我们可以知道两个人同时喜欢歌曲的总数平均数为 $\frac{m}{4}$，我们可以认为当两位听众同时喜欢的歌曲数大于 $\frac{m}{2}$ 时，它们具有相同口味。

由马尔可夫不等式
$$
P(Y_{i_1i_2} > \frac{m}{2}) \le \frac{1}{2}
$$

这样，两个人具有相同口味的概率不超过 $\frac{1}{2}$。

采用上面的位运算算法，直接输出超过 $\frac{m}{2}$ 的结果即可，时间复杂度为 $O(n^2)$。
