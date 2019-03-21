---
title: 随机算法习题 1
date: 2019-03-20 23:30:51
categories:
- 算法
- 随机算法
tags:
- randomized algorithm
---

随机算法里面的 Las Vegas 算法、Monte Carlo 算法、姚期智不等式等等的习题。

<!-- more -->

# 习题一

## 1.1

![20190312161434.png](https://i.loli.net/2019/03/12/5c876a6d75ef6.png)

(1)

该该算法属于 Las Vegas 算法，因为该算法不会产生不正确的解，但运行时间不确定。

(2)

第一次考虑的集合大小为 $n$，将其分为 3 堆，长度分别为：$|S_1|, 1, |S_2|$，令 $l = |S_1|$，通过讨论 $l$ 值来确定各种情况的概率：

1. $l < k-1$: 此时就算加上元素 $s$ 仍有 $l+1 < k$，也就是说第 $k$ 小元素一定出现在 $S_2$ 中，这对应于第 5 行。此时继续考虑 $S_2$，而 $S_2$ 的长度在 (n-k+1) ~ (n-1) 之间，平均长度为 $(n - \frac{k}{2})$。
2. $l = k-1$: 此时第 $k$ 小元素一定是 $s$，这对应于第 3 行。此时算法结束。
3. $l > k-1$: 此时第 $k$ 小元素一定在 $S_1$ 中，这对应于第 4 行。此时继续考虑 $S_1$，而 $S_1$ 的长度在 k ~ (n-1) 之间，平均长度为 $\frac{k+n-1}{2}$。

> 注意，题目中第 4 行应该改为 $|S_1| > k-1$ 才对。

这三种情况出现的概率分别为：$\frac{k-2}{n}$, $\frac{1}{n}$, $\frac{n-k+1}{n}$。

这一轮考虑的集合大小为 $E(Z_1) = n$，第二轮考虑的集合大小的数学期望为：

$$
\begin{aligned}
    E(Z_2)
    &= \frac{k-2}{n}(n - \frac{k}{2}) + \frac{n-k+1}{n}\frac{k+n-1}{2} \\
    &= \frac{2kn-k^2-4n+2k+n^2-k^2+2k-1}{2n} \\
    &= \frac{n^2 + (2k-4)n - 2k^2+4k-1}{2n} \\
    &< \frac{n^2 + (2n-4)n - 2n^2+4n-1}{2n} \\
    &= \frac{n^2-1}{2n} \\
    &< \frac{n}{2}
\end{aligned}
$$

这样直接放缩不太精确，我们可以令 $k = tn, t \in [\frac{1}{n}, 1]$，可以得到等式：

$$
E(Z_2) = (\frac{1}{2}+t-t^2)n - \frac{1}{2n} < (\frac{1}{2}+t-t^2)n
$$

令 $b = \frac{1}{2}+t-t^2, b \in [\frac{1}{2} + \frac{1}{n} - \frac{1}{n^2}, \frac{3}{4}]$ 即可，则有 $E(Z_2) < bn$。

以此递推，不难得到：

$$
E(Z_i) < bn, i \ge 2
$$

<!-- 以此递推，每一轮考虑的集合大小都会较上一轮更小，忽略 $- \frac{1}{2n}$，令 $m = \frac{1}{2}+t-t^2 < 1$， 我们得到递推过程中所考虑的集合大小的数学期望为：

$$
\begin{aligned}
    E(Z)
    &= n + mn + m^2n + \cdots m^{\infty}n \\
    &= n + \frac{mn}{1-m} \\
    &= \frac{n}{1-m}
\end{aligned}
$$

$m \in (\frac{1}{2}, \frac{3}{4}), E(Z) \in (\frac{4}{3}n, 2n)$ -->

(3)

$$
\begin{aligned}
    T(n) &= E(Z_1) + E(Z_2) + \cdots + E(Z_m) + \cdots \\
    &< n + bn + b^2n + \cdots b^{\infty}n \\
    &= \frac{n}{1-n} \\
    &= O(n)
\end{aligned}
$$

## 1.2

![20190320201630.png](https://i.loli.net/2019/03/20/5c922f223a68c.png)

算法的基本思想：只用实际值对等式进行验证是否成立，当验证的值足够多时，算法的正确性提高。

算法如下：

设 $d = \max(m + n, l)$，从 $\{1, \cdots, 100d\}$ 中均匀随机地选取一个整数 $r$。计算 $s(x) = p(x)q(x) - r(x)$ 的值。如果 $s(x) = 0$，则算法判定等式成立；否则，算法判定等式不成立。

判断结果分析：

1. 若等式成立，对于任意的 $r$，都有 $s(r) = 0$，算法将给出正确的结论
2. 若等式不成立，算法发现 $s(r) \neq 0$，则给出正确的结论
3. 若不等式成立，但是算法发现 $s(r) = 0$，也就是说 $r$ 恰好为 $s(x) = 0$ 旳根，由于 $s(x)$ 的次数不大于 $d$，那么 $s(x) = 0$ 旳根的数量 $t \le d$，所以这种情况出现的概率 $P(error)  = \frac{t}{100d} \le \frac{d}{100d} = \frac{1}{100}$

时间复杂度分析：由于 $s(x)$ 的次数不大于 $d$，算法的运行时间为 $O(d)$。

随机算法的类别：由于运行时间固定，但是可能给出不正确的解，所以此算法为 Monte Carlo 算法。

## 1.3

![20190320201732.png](https://i.loli.net/2019/03/20/5c922f5f327f6.png)

验证 $A_{p \times q}B_{q \times r} = C_{p \times r}$ 是否成立。

算法的基本思想：类似于上一题，两边同乘以一个向量，结果相等时，认为等式成立。

算法如下：

随机抽取一个向量 $\overrightarrow{s} = (s_1, s_2, \cdots, s_r)^T \in \{0, 1\}^n$，然后计算 $AB\overrightarrow{s}$，即先计算 $B\overrightarrow{s}$，再计算 $A(B\overrightarrow{s})$，也计算 $C\overrightarrow{s}$。如果 $A(B\overrightarrow{s}) \neq C\overrightarrow{s}$，则 $AB \neq C$，否则返回 $AB = C$，但结果不一定正确。

算法的错误率 $P(error)$ 为 $AB \neq C$ 但 $A(B\overrightarrow{s}) \neq C\overrightarrow{s}$ 的概率。

$error$ 事件等价于事件 $D_{p\times r} = AB - C \neq 0$ 但是 $D\overrightarrow{s} = 0$，由于 $D \neq 0$，所以其必有某个非零元素，不失一般性，设非零元素为 $d_{11}$。考虑 D 第一行乘以 $\overrightarrow{s}$ 第 1 列（注意 $\overrightarrow{s}$ 只有一列）：

$$
\sum_{j=1}^nd_{1j}s_j = 0
$$

等价地有：

$$
s_1 = - \frac{\sum_{j=2}^nd_{1j}s_j}{d_{11}}

\tag{1}
$$

根据向量 $\overrightarrow{s}$ 的取法，我们可以认为每一个 $s_i$ 的是独立均匀地从 $\{0, 1\}$ 中选取的。

现在考虑等式 $(1)$，在右边值都确定的时候，$s_1$ 有两种选择，但是使等式成立的值只有一个，所以等式成立的概率至多为 $\frac{1}{2}$，也就是说原等式 $AB = C$ 的概率至多为 $\frac{1}{2}$，$P(error) \le \frac{1}{2}$。

算法的时间复杂度：

算法需要做三次矩阵-向量乘法：

1. $B\overrightarrow{s}: O(q\times r)$
2. $A(B\overrightarrow{s}): O(p\times q)$
3. $C\overrightarrow{s}: O(p\times r)$

总的时间复杂度为：$O(\max(p, q, r)^2)$

算法的类型：由于运行时间确定，但是可能给出不正确的结果，此算法属于 Monte Carlo 算法。

算法的改进：重复进行 $k$ 次实验，$P(error') \le \frac{1}{2^k}$，时间复杂度为 $O(k\max(p,  q, r)^2)$。

## 1.4

![20190320201808.png](https://i.loli.net/2019/03/20/5c922f83a32a8.png)

1. 很显然，得到的 `cut` 一定是一个割。
2. 为了让 `cut` 中的边数最少，我们要让 $T_1$ 与 $T_2$ 之间在原图 G 中的连接数最少。我们划分 $T_1$ 与 $T_2$ 的方法总共有 $n$ 种，至少只有一种是让 $T_1$ 与 $T_2$ 之间在原图 G 中的连接数最少的选择。

查到了这篇文章：https://www.cs.princeton.edu/courses/archive/fall13/cos521/lecnotes/lec2final.pdf

只是简短地提了一下这个算法与我们学到的 Karger’s algorithm 是等价的。

也在 CMU 找到了：https://www.cs.cmu.edu/~avrim/Randalgs97/lect0122

根据 MIT 的算法导论 http://www.cs.tau.ac.il/~zwick/grad-algo-13/mst.pdf，最小生成树也可以使用收缩法进行构建，我们可以把最小生成树的构建过程看作是 2.6 节中的边的收缩过程，因为最小生成树的构建过程中使用 union-find data structure 将点合在同一个子图中时就等价与 2.6 中的收缩（采用 Prim 算法）。

不失一般性，不妨假设最终删除的边就是我们在构建最小生成树时加入的最后一条边。我们需要求的就是每次新加进来的边（除了最后一次，一共 n-2 条边）都不在 U 中的概率。

整个计算过程和 2.6 是一样的：

$$
\begin{aligned}
P[\cup_{i=1}^{n-2}A_i] &= P[A_{n-2}|\cup_{i=1}^{n-3}A_i] \\
&\cdot P[A_{n-3}|\cup_{i=1}^{n-4}A_i] \\
&\vdots \\
&\cdot P[A_2|A_1] \\
&\cdot P[A_1] \\
&\le (1 - \frac{k}{\frac{nk}{2}})(1-\frac{k}{\frac{(n-1)k}{2}}) \cdots \\
&= \frac{n-2}{n} \cdot \frac{n-3}{n-1} \cdot \frac{n-4}{n-2} \cdots \frac{1}{3} \\
&= \frac{2}{n(n-1)} \\
&\ge \frac{2}{n^2}
\end{aligned}
$$

$$
P[\cup_{i=1}^{n-2}A_i] \ge \frac{2}{n^2} = \Omega(\frac{1}{n^2})
$$

## 1.5

![20190320214608.png](https://i.loli.net/2019/03/20/5c9244248b79f.png)
![20190320214619.png](https://i.loli.net/2019/03/20/5c92442e88773.png)

(1)

<!-- 假设 $I$ 不是 $G$ 的独立集，那么 $\exists u_0v_0 \in E, u_0 \notin I 且 v_0 \notin I$。那么在 3 - 6 的循环中必然没有遍历到顶点 $u_0$ 和 $v_0$ -->

独立集的定义是：图的一组顶点集，其中任意两个互不邻接。

算法得到的 $I$ 一定是独立集，对于任意两个邻接点 $u_0, v_0$，不失一般性，设 $u_0$ 的标签较小，如果 $u_0 \in I$，那么它的邻接点 $v$ 一定在第 6 步中从 $S$ 中删除了，不可能在后续被添加到 $I$ 中。这样就证明了任意两个邻接点不可能同时在 $I$ 中， $I$ 是独立集。

拓展：

虽然可以得到独立集，但不一定是最大独立集，得到的结果是否是最大独立集与标签的选取有关，这里体现了随机性：

![不同标签得到的结果不同，可能是最大独立集，剽窃自另一位同学](https://i.loli.net/2019/03/20/5c9213b2229fc.png)

(2)

设 $u$ 的邻接点分别为 $v_1, v_2, \cdots, v_u$，将 $<u, v_1, v_2, \cdots, v_{d_u}>$ 按照标签大小排序之后的序列为 $<v_{i_1}, v_{i_2}, \cdots, v_{i_m}, u, v_{i_{m+1}}\cdots, v_{i_{d_u}}>$，因为只有『$u$ 的标签最小会有 $u \in I$』：

$$
P(u \in I) = \frac{P(m = 0)}{P(m=0) + P(m=1) + \cdots + P(m=d_u)} = \frac{1}{d_u+1}
$$

## 1.6

不失一般性，考虑升序排列的情况。

考虑 2 个元素的情况：

|序列|置换次数|
|:--:|:-----:|
|1, 2|0|
|2, 1|1|

考虑 3 个元素的情况：

|序列|置换次数|
|:--:|:-----:|
|1, 2, 3|0|
|1, 3, 2|1|
|2, 1, 3|1|
|2, 3, 1|1 + 1 = 2|
|3, 1, 2|2|
|3, 2, 1|2 + 1 = 3|

假设现在输入序列为 $a_1, a_2, \cdots, a_n$，它是由 $1, 2, \cdots, n$ 经过 $k$ 次倒置之后得到的结果。

想了半天没有想出来，查着查着查到了之前在行列式里面学过的逆序对数，发现这里的置换次数恰好等于逆序对数。

找到几个很有用的帖子：

1. https://math.stackexchange.com/questions/2280185/inversion-count-and-number-of-transpositions
2. https://math.stackexchange.com/questions/453686/what-is-the-expected-number-of-swaps-performed-by-bubblesort

核心的思想是：冒泡排序过程中，每一次置换都会让逆序对数恰好减 1，那么：

定理 1：逆序对数 = 冒泡排序置换次数

我们就是要求所有排列的逆序对数的数学期望：

定义：

$$
I_{ij} = \begin{cases}
    1 \quad (a_i, a_j) 是逆序对 \\
    0 \quad (a_i, a_j) 是正序对
\end{cases}
$$

$$
E[I_{ij}] = \frac{1}{2}
$$

那么逆序对数的数学期望为：

$$
E[\sum_{i=1}^n\sum_{j>i}^nI_{ij}] = \sum_{i=1}^{n}\sum_{j>i}^n\frac{1}{2} = \frac{n(n-1)}{2}\frac{1}{2} = \frac{n(n-1)}{4}
$$

## 1.7

![20190320193428.png](https://i.loli.net/2019/03/20/5c922548901f2.png)

虽然函数值被篡改，我们可以用到关键条件：

$$
F( (x+y) \mod n) = F(x)+F(y) \mod m
$$

定义新运算 $\ominus$，$a \ominus b = (a - b)\mod n$

直接计算 $F(z)$ 是不行的，对于未被篡改的数据正确率为 $1$，而对于被篡改的数据正确率为 $0$。

题目要求任意 $z$，我们应该做最坏的打算，假设 $z$ 处的函数值恰好被篡改了：

均匀随机地选择 $t \in [1, n-1]$ 计算 $F(z\ominus t)$ 和 F(t)，注意到 $z\ominus t$ 和 $t$ 不是相互独立的，错误率为 $P(error) = P(F(z\ominus t) 损坏 \cup F(t) 损坏 \le (\frac{1}{5} + \frac{1}{5}) = \frac{2}{5}$

算法运行 3 次，返回出现次数最多的结果，如果出现次数一样多，但会第一次的结果。

算法运行 1 次错误率为 $p \le \frac{2}{5}$

算法运行 3 次，算法最终出错等价于至少两次出错，概率为：

$$
C_3^2p^2(1-p) + C_3^3p^3 \le 3 \times (\frac{2}{5})^2\times\frac{3}{5} + (\frac{2}{5})^3 = \frac{44}{125} = 0.352
$$

这其中还要减去一个第一次算对了，后两次出错了的情况，此时会返回正确结果，因此错误率为：

$$
(C_3^2-1)p^2(1-p) + C_3^3p^3 \le 2 \times (\frac{2}{5})^2\times\frac{3}{5} + (\frac{2}{5})^3 = \frac{32}{125} = 0.256
$$

最终正确的概率大于 1 - 0.256 = 0.744

<!-- 1. 3 次结果一样：正确率下界为 $1 - \frac{2}{5}^3 = \frac{117}{125} = 0.953344$
2. 两次结果一样，另外一次不一样，正确率下界为 $[1-(1 - \frac{16}{25})^2]\cdot(1 - \frac{16}{25}) = \frac{4896}{15625} = 0.313344$
3. 三次结果都不一样，这里随机返回一个结果，正确概率为 $\frac{16}{25}\cdot(1 - \frac{16}{25})^2 = \frac{1296}{15625} = 0.082944$ -->

## 课堂练习

证明**基于比较的**随机排序算法不能突破下界 $O(n\log n)$。

利用姚期智不等式：

$$
\min_{A \in \mathcal{D}} A 在 I_p 上的期望运行时间 \\
\le \max_{I\in\mathcal{I}} R 在 I 上的运行时间
$$

通过 [Google](https://www.google.com/search?q=prove+that+randomized+algorithm+sorting+lower+bound) 找到 [CMU 的资料](https://www.cs.cmu.edu/~avrim/451f11/lectures/lect0913.pdf)。

（下文在输入数据量为 n 的前提下进行讨论。）

定理 1：任何基于比较的确定性排序算法，**平均**比较次数至少为 $\lfloor\log_2(n!)\rfloor$。

根据定理 1，不管我们选择什么分布 p，最终的随机算法的时间下界都是 $\lfloor\log_2(n!)\rfloor = O(n\log n)$。

定理 1 的证明：

<!-- <iframe src="http://docs.google.com/gview?url=https://www.cs.cmu.edu/~avrim/451f11/lectures/lect0913.pdf&embedded=true" style="height:700px;" frameborder="0"></iframe> -->

<!-- <embed src="https://drive.google.upupming.site/viewerng/viewer?embedded=true&url=https://upupming.site/2019/03/20/las-vegas-monte-carlo-yao-etc/lect0913.pdf" width=800px height=1100px> -->

定理 1 的证明关键用到了 1 条引理：

引理 1：任何基于比较的确定性排序算法，**最坏情况下**比较次数至少为 $\lfloor\log_2(n!)\rfloor$。

引理 1 的证明：

1. 排序的目的就是输出原序列一个排列，总排列数为 $n!$，其中只有一个排列是唯一正确的答案。
2. 算法通过一系列比较的答案 YES 或 NO 来推断出 $n!$ 个排列中正确的那一个，而『对手』却想方设法构建不好的输入让算法进行最多的比较次数才能得出答案。
3. 初始排列集合为 $S$，满足 $|S| = n!$，每次比较根据回答的结果是 YES 还是 NO，可以将 $S$ 划分成两个子集
4. 『对手』总是给出划分之后较大的那个集合，这样算法最多只能将 $S$ 大小变为原来的 $\frac{1}{2}$。
5. 算法结束的条件是 $|S| = 1$，算法必须至少进行 $\log_2(n!)$ 次比较。

在引理 1 的基础上证明定理 1：

我们可以把算法的执行看成一棵 $S$ 的决策树，这棵树是由算法的每一次比较结果构建而成的，具有 $n!$ 个叶子结点。其中叶子的深度就是对这种排列进行判定时经历的比较次数。我们只需证明所有叶子节点的平均深度至少为 $\lfloor\log_2(n)!\rfloor$。（在引理 1 中的第 3 步，其实考虑的就是最深的叶子节点的深度）

1. 如果决策树是完全平衡的，也就是说任意两个叶子节点的深度最多相差 1，由于每个叶子结点深度都为 $\lfloor\log_2(n)!\rfloor$ 或者 $\lceil\log_2(n)!\rceil$，得证。
2. 我们只需证明，所有叶子结点数量相同的树中，只有完全平衡树的平均深度才是最小的。对于某个不平衡的树，我们将两个最深的兄弟叶子结点移为最浅叶子结点的孩子。因为最深和最浅深度之差至少为 2，这个操作将平均深度减少了。定量来讲，最深、最浅叶子深度为 $D, d$，那么我们较少的深度是 $A = 2D + d$，增加的深度是 $B = 2(d+1) + D-1$，很显然 $A > B$。经过不断重复操作，我们可以得到一个完全平衡树，这个完全平衡树的平均深度小于原来的非平衡树的平均深度。得证。

## Useful links

1. http://www.bioinfo.org.cn/~wangchao/maa/Probability_and_Computing.pdf
2. http://www.cs.ox.ac.uk/people/varun.kanade/teaching/CS174-Fall2012/HW/HW1_sol.pdf