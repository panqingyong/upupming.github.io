---
title: 球和箱子模型、随机图
categories:
- 算法
- 随机算法
tags:
- randomized algorithm
---

『球和箱子模型』满足下列条件：

1. $m$ 个球随机地投入 $n$ 个箱子；
2. 投入一个箱子里的每个球是独立且均匀的选取的。

文中介绍其理论及相关应用：

- 生日悖论：单射
- 赠券收集：满射
- 最大负载：原像

<!-- more -->

## 与硬币投掷相关的三种分布

### 两点分布（Bernoulli trial）

投掷一枚【有偏】硬币，实验结果用随机变量 $X$ 表示：

$$
X = \begin{cases}
    1,\quad 头面朝上 \\
    0,\quad 背面朝上
\end{cases}
$$

定义 $Pr(X = 1) = p$，则有 $Pr(X = 0) = (1-p)$。

均值：
$$
E(X) = p
\tag{1}
$$

方差：
$$
\begin{aligned}
    D(X)
    &= p \cdot (1-p)^2 + (1-p) \cdot (0 - p)^2 \\
    &= p(1-p)[(1-p)+p] \\
    &= p(1-p)
\end{aligned}
\tag{2}
$$

### 几何分布

记【独立同分布】地重复 Bernoulli 实验直到实验成功（第一次出现头面朝上）所需的实验次数为随机变量 $X$，根据定义有

$$
Pr(X=k)=(1-p)^{k-1}p
\tag{3}
$$

#### 无后效性

$$
P(X=n+k | X>k) = P(X=n)
\tag{4}
$$

证明：

$$
\begin{aligned}
P(X=n+k|X>k)
&= \frac{P(X=n+k \land X>k)}{P(X > k)} \\
&= \frac{P(X=n+k)}{P(X > k)} \\
&= \frac{(1-p)^{n+k-1}p}{\sum_{i=k}^{\infty}(1-p)^ip} \\
&= \frac{(1-p)^{n+k-1}p}{(1-p)^k} \quad (*) \\
&= (1-p)^{n-1}p \\
&= P(X=n)
\end{aligned}
$$

其中 $(*)$ 处的结果得到有两种方式：

1. 等比数列求和（直接求）

    $$
    \begin{aligned}
    \sum_{i=k}^{\infty}(1-p)^ip
    &= \frac{a_1[(1-q)^n]}{1-q} \\
    &= \frac{(1-p)^kp[1-(1-p)^{\infty}]}{1-(1-p)} \\
    &= \frac{(1-p)^kp}{p} \\
    &= (1-p)^k
    \end{aligned}
    $$

2. 利用级数求（构造级数形式）

    需要知道：
    $$
    \begin{aligned}
    \frac{1}{p} 
    &= 1 + (1-p) + (1-p)^2 + \cdots \\
    &= \sum_{k=0}^{\infty}(1-p)^k
    \end{aligned}
    $$
    所以：
    $$
    \begin{aligned}
    \sum_{i=k}^{\infty}(1-p)^ip
    &=(1-p)^kp\sum_{i=0}^{\infty}(1-p)^i \\
    &=(1-p)^k
    \end{aligned}
    $$

虽然老师讲课的时候用的都是第二种方法，但是我个人更加偏好第一种方法，因为无需构造，更加直观。

#### 数字特征

期望
$$
E(X) = \frac{1}{p}
\tag{5}
$$
这是很容易想到的，正面的概率为 $\frac{1}{5}$ 的话，平均需要投掷 $5$ 次才会出现正面。
证明：
$$
\begin{aligned}
E(X)
&= \sum_{k=1}^{\infty}kP(X=k) \\
&= \sum_{k=1}^{\infty}k(1-p)^{k-1}p \\
&= p\sum_{k=1}^{\infty}k(1-p)^{k-1} \\
\end{aligned}
$$
这里需要用到级数求导，当然用[错位相减法](https://zhuanlan.zhihu.com/p/37431559)也是可以的，我前面选择了数列的方法，这里就继续用错位相消法，令
$$
S = \sum_{k=1}^{\infty}k(1-p)^{k-1}
$$
则：
$$
(1-p)S = \sum_{k=1}^{\infty}k(1-p)^{k} = \sum_{k=2}^{\infty}(k-1)(1-p)^{k-1}
$$
上式减下式，得：
$$
\begin{aligned}
pS
&= 1\cdot(1-p)^0+\sum_{k=2}^{\infty}(1-p)^{k-1} \\
&= 1 + \frac{1-p}{p} \\
&= \frac{1}{p}
\end{aligned}
$$

方差
$$
D(X) = \frac{1-p}{p^2}
\tag{6}
$$

看到这里不妨不看这个式子，猜想一下，什么时候方差最大呢？

方差表示需要实际的次数与平均所需次数之间的偏离程度，假设 $p = 0$，两个次数肯定都是无穷大，方差【无法目测】；但是假设 $p=1$，肯定都是 1，方差为 0。实际上，[方差图像](https://www.wolframalpha.com/input/?i=%5Cfrac%7B1-p%7D%7Bp%5E2%7D)如下：

![几何分布方差图像](https://i.loli.net/2019/04/06/5ca8a66e24472.png)

在 $p = 0$ 时方差最大，方差是随 $p$ 递减的（求导会很显然）。

### 二项分布

【独立同分布地】重复 Bernoulli 实验 n 次，成功实验（得到正面）的总次数记为随机变量 $X$，即定义：

$$
Pr(X=k) = C_n^k(1-p)^kp
\tag{7}
$$

定义：

$$
X_i = \begin{cases}
1, \quad 表示第 i 次实验成功 \\
0, \quad 表示第 i 次实验失败
\end{cases}
$$

每个 $X_i$ 都服从两点分布，不同 $X_i$ 之间相互独立。

由期望的线性性质：
$$
E(X) = \sum_{i=1}^{n}X_i = np
\tag{8}
$$

由各个 $X_i$ 的相互独立性：
$$
D(X) = \sum_{i=1}^nD(X_i) = np(1-p)
\tag{9}
$$

## 桶排序及其时间复杂度分析

### 基本思想

1. 假设所有输入值均等可能地取自 $[0, 1)$
2. 初始化 $n$ 个桶，编号介于 $[0, n-1]$ 之间
3. 扫描输入，将数值 $A[i]$ 放入编号为 $\lfloor nA[i]\rfloor$ 的桶中
4. 将各个桶内的数据各自排序
5. 依编号递增的顺序输出各个桶内的数据

需要一系列桶，需要排序的值变换为桶的索引，桶内元素需要比较，桶与桶之间【无需比较】，因此复杂度可以突破基于比较的排序的算法的时间复杂度下限 $O(n\log n)$。

算法伪代码如下：

$$
\begin{aligned}
&=========================================== \\
&算法 BucketSort(A) \\
&Input: 数组 A[0:n-1], 0 \le A[i] < 1 \\
&Output: 排序后的数组 A \\
&=========================================== \\
& for \ j \ \leftarrow \ 0 \ to \ n-1 \ do \ // 初始化 n 个桶 \\
& \quad B[j] \ \leftarrow NULL \\
& for \ i \leftarrow \ 0 \ to \ n-1 \ do \\
& \quad 将元素 A[i] 插入桶 B[\lfloor nA[i] \rfloor] 中 \ // 链表维护 \\
& for \ i \leftarrow \ 0 \ to \ n-1 \ do \\
& \quad 用 InsertionSort 排序桶 B[i] 内的数据 \\
& 依编号递增顺序将各个桶内的数据回填到 A 中
\end{aligned}
$$

### 例子

![桶排序示例](https://i.loli.net/2019/04/07/5ca9609aa14bb.png)

#### 时间复杂度分析

散列过程需要 $O(n)$ 时间将 $n$ 个数据项散列到桶中，可以视为将 $n$ 个球投入 $n$ 个箱子中（这里算法选取的桶的个数恰好恰好等于数组的长度）。

我们记 $X_i, i \in [0, n-1]$ 为各个桶中数据项的个数，则 $X_i$ 服从参数为 $(n, \frac{1}{n})$ 的二项分布，因为共有 $n$ 次投掷试验，每次投掷实验球都以独立的概率进入到箱子 $i$ 中。

期望
$$
E(X_i) = np = 1
$$

方差
$$
D(X_i) = np(1-p) = 1 - \frac{1}{n}
$$ 

那么排序箱子 $i$ 内的元素需要的时间为常数时间，总共有 $n$ 个箱子，所需的时间是 $O(n)$。

可以更加具体的进行计算，每个桶内的排序时间由于使用了 InsertionSort（最坏时间复杂度 $\frac{n^2}{2}=O(n^2)$），平均时间复杂度不超过 $\frac{1}{2}E(X_i^2)$。

$$
\begin{aligned}
E(T_n)
&= \sum_{i=0}^{n-1}\frac{1}{2}E(X_i^2) \\
&= \frac{1}{2}n [1 + (1-\frac{1}{n})] \\
&= n - \frac{1}{2}
\end{aligned}
$$

### 跳表及其时间复杂度分析

> 参见《随机算法》第 8 章

在全序集（满足反对称、传递、完全性） $S = \{-\infty < x_1 < x_2 < \cdots < x_n < +\infty\}$ 支持查找、插入、删除。

跳表是一个分层的有序链表结构，最大层数记为 $r$。层用 $L_i$ 表示，越往上，$i$ 越大，因此 $L_{i+1} \subseteq L_i$，$L_1 = S, L_r = \{-\infty, +\infty\}$。

对于 $\forall x \in L_{i+1} \subseteq L_i$，都有指针从 $L_{i+1}$ 中的 $x$ 指向 $L_i$ 中的 $x$。

![跳表的层次结构](https://i.loli.net/2019/04/07/5ca96a62b11fe.png)

#### Find(x)

$Find(x)$ 需要从 $L_r$ 开始逐层用【顺序比较】定位 $x$ 所在的区间直到 $L_i$。将查找区间的平均长度记为 $E(\text{Interval})$，最坏情况下每一层需要全部查找，所需的时间复杂度为 $r\cdot E(\text{Interval})$。（顺序比较可以换位二分查找，更加快，但没有太大的必要，跳表本质就是二分后的）

![Find(x)](https://i.loli.net/2019/04/07/5ca96ef9837f8.png)

#### Delete(x)

从 $L_r$ 开始逐层用【顺序比较】定位 $x$ 所在区间直到 $L_i$。若在 $L_i$ 的某个区间中找到 $x$，则沿 $x$ 的层间指针删除 $x$，最坏时间复杂度不到 $Find(x)$ 的两倍，是同阶函数。

![Delete(x)](https://i.loli.net/2019/04/07/5ca96f28eec9a.png)

#### Insert(x)

以参数 $p = \frac{1}{2}$ 产生符合【几何分布】的随机数 `temp`。

> `temp` 的含义是将要被插入的元素的层数，选取是随机的，服从几何分布有。

1. 若 `temp` $\ge r$，初始化 $L_{temp+1} = \{-\infty, +\infty\}$，初始化 $L_{r+1}, L_{r+2}, \cdots, L_{temp}$ 并将 $x$ 插入其中。
2. 在 $L_{\min \{r, temp\}}, \cdots, L_1$ 中逐步定位 $x$ 所在区间并将 $x$ 插入 $L_i$。
3. 若 `temp` > $r$，则更新 $r$ 为 `temp` + $1$

下面是一个具体的例子。

![Insert(5)](https://i.loli.net/2019/04/07/5ca97127c8417.png)

需要插入 $5$，随机生成的 `temp` 为 $2$，可以顺便算一下这个概率探究为什么要选取几何分布：

$$
P(temp = 2) = (1-p)p = \frac{1}{4}
$$

`temp` 值越大，出现的概率越小。

这里 `temp` 为 $2 \ge r=0$，那么需要初始化 $L_{3} = \{-\infty, +\infty\}, L_2, L_1$，直接插入层 $L_2, L_1$ 即可。

![Insert(1)](https://i.loli.net/2019/04/07/5ca97285396dd.png)

同理，这里生成的 `temp` 为 $1$，因此插入 $1$ 到 $L_1$。

![Insert(3)](https://i.loli.net/2019/04/07/5ca9734634a6e.png)

这里生成的 `temp` 为 $3 = r$，初始化 $L_4 = \{-\infty, +\infty\}$，将 $3$ 插入到 $L_3, L_2, L_1$ 中。

#### 空间复杂度

每个元素 $e_i$ 在插入时层数 $X_i$ 服从 $p = \frac{1}{2}$ 的几何分布，所有元素的总存储次数为：

$$
X = \sum_{i=1}^n (X_i+1)
$$

每一个元素的每次存储需要 $O(1)$ 空间，$E(X)$ 是空间复杂度

$$
\begin{aligned}
E(X)
&= E[\sum_{i=1}^n (X_i+1)] \\
&\xlongequal{期望的线性性质} \sum_{i=1}^n [E(X_i)+1] \\
&\xlongequal{几何分布的期望} n \cdot \frac{1}{p} + n \\
&\xlongequal{p = \frac{1}{2}} 3n
\end{aligned}
$$

因此，跳表的空间复杂度为 $O(n)$。

#### 时间复杂度

##### 最大层数

跳表的层数 $r = 1 + \max_i X_i$，有 $E(r) = O(\log n)$，证明过程如下。

$$
\begin{aligned}
P(X_i \le k)
&= p + p(1-p) + \cdots + p(1-p)^k \\
&= \frac{p [1-(1-p)^{k+1}]}{1-(1-p)} \\
&= 1-(1-p)^{k+1} \\
&= 1-2^{-(k+1)}
\end{aligned}
$$

$$
\begin{aligned}
P(\max_i X_i \le k)
&= P(X_1 \le k \land \cdots \land X_n \le k) \\
&\xlongequal{独立性} [1-2^{-(k+1)}]^n \\
\end{aligned}
$$

$$
\begin{aligned}
P(\max_i X_i \le k-1) = (1-2^{-k})^n
\end{aligned}
$$

上式减下式得到：

$$
\begin{aligned}
P(\max_i X_i = k)
&= [1-2^{-(k+1)}]^n - (1-2^{-k})^n
\end{aligned}
$$

$$
\begin{aligned}
E(\max_i X_i)
&= \sum_{k=1}^{\infty}P(\max_i X_i = k) \cdot k \\
&= [1-2^{-2}]^n - (1-2^{-1})^n \\
& \quad + 2[1-2^{-3}]^n - 2(1-2^{-2})^n \\
& \quad + 3[1-2^{-4}]^n - 3(1-2^{-3})^n \\
& \quad + \cdots \\
& \quad + m[1-2^{-(m+1)}]^n - m(1-2^{-m})^n \\
& \quad + \cdots \\
&= \lim_{m \to \infty} {- (1-2^{-1})^n - (1-2^{-2})^n - \cdots - (1-2^{-m})^n + m[1-2^{-(m+1)}]^n} \\
&= 
\end{aligned}
$$

> TODO: 老师说这个证明过程出了问题，等有时间再看一下。

## 生日悖论

> 要满足单射，是比较难的，选 57 个人就很容易打破单射格局。

之所以称为『悖论』，是因为这是一个与人们常识不符的结论，但是确是【正确的结论】。

- 假设：所有人的生日均匀独立地分布
- 直觉：多大的人群才能确保有相同生日的人？（365吗）
- 事实：任意随机选出 $m \ge 57$ 人，则其中有两人具有相同生日的概率大于 $99%$。

球和箱子模型：

将 $m$ 个球放入 $n$ 个箱子，事件 $\Epsilon$ 表示不存在有 $2$ 个球的箱子，这也等价于随机函数 $f:[m]\to[n]$ 是单射。

可以这样计算：

$$
P(\Epsilon) = \frac{[m]\xrightarrow{1-1}[n]}{n^m} = \frac{C_n^m}{n^m} = \frac{n \cdot (n-1) \cdot \cdots \cdot (n-m+1)}{n^m} = \prod_{k=0}^{m-1}\left(1-\frac{k}{n}\right)
$$

也可以用另外一种计算方式：

$$
\begin{aligned}
P(没有两个球投入同一个箱子)
&= \prod_kPr(第 k+1 个球投入空箱子 | 前 k 个球没有两个投入同一个箱子) \\
&= P\left(\land_{k=1}^m\Epsilon_i\right) \\
&= \prod_{k=1}^mP\left(\Epsilon_k | \land_{i<k}\Epsilon_i\right) \\
&= \frac{n}{n} \cdot \frac{n-1}{n} \cdots \frac{n-(m-1)}{n} \\
&= \prod_{k=0}^{m-1}(1-\frac{k}{n})
\end{aligned}
$$

这两种计算方式的结果是一样的。

我们进一步对结果使用泰勒展开 $e^{-k/n}\approx 1-\frac{k}{n}$，得到：

$$
\begin{aligned}
P(\Epsilon) 
&= \prod_{k=0}^{m-1}(1-\frac{k}{n}) \\
&\approx \prod_{k=0}^{m-1}e^{-k/n} \\
&= \exp(-\sum_{k=0}^{m+1}\frac{k}{n}) \\
&= \exp[-m(m-1)/2n] \\
&\approx \exp(-m^2/2n)
\end{aligned}
$$

令 $P(\Epsilon)=\epsilon$，解得：

$$
m = \sqrt{2n\ln \frac{1}{\epsilon}}
$$

或者

$$
n = \frac{m^2}{2\ln \frac{1}{\epsilon}}
$$

在生日悖论中，$n=365,\epsilon=0.01,m\approx57$。

## 赠券收集

> 要想实现满射也是比较难的，需要投掷 $n \ln n + O(n)$ 个球才能确保无空箱子。

问题：收集玩 12 生肖平均需要买多少包香瓜子？

假设确保 $n$ 个箱子均不为空，需要投入 $X$ 个球。$X_i$ 表示已有 $i-1$ 个箱子非空，空箱子减少一个需要再投入的球的个数。

$$
X = \sum_{i=1}^{n}X_i
$$

$X_i$ 服从几何分布，$p_i = 1-\frac{i-1}{n}$，$E[X_i] = \frac{1}{p_i} = \frac{n}{n-i+1}$。

根据期望的线性性质，有：

$$
\begin{aligned}
E[x]
&= \sum_{i=1}^n E[X_i] \\
&= \sum_{i=1}^n \frac{n}{n-i+1} \\
&= n \sum_{i=1}^{n} \frac{1}{i} \\
&= n H_n
\end{aligned}
$$

老师讲过调和级数 $\sum_{i=1}^n\frac{1}{i} = O(\ln n) + 1$，用图像法 $\frac{1}{x}$ 证明的，参考[维基百科](https://en.wikipedia.org/wiki/Harmonic_series_(mathematics)#Rate_of_divergence)也可以。最终得到从期望的角度看，平均需要投掷 $n \ln n + O(n)$ 个球就能确保无空箱子。

定理：$P(X \ge n \ln n + cn) < e^{-c}$ 对任意 $c>0$ 成立。

证明：

$Y_i$ 表示投入 $n \ln n + cn$ 个球之后，第 $i$ 个箱子是空箱子。

$P(Y_i) = (1-\frac{1}{n})^{n(\ln n+c)} < e^{-(\ln n+c)} = e^{-c} / n$

$$
\begin{aligned}
P(投入 n\ln n + cn 个球之后仍有空箱子)
&= P(Y_1 \lor \cdots \lor Y_n) \\
&\le P(Y_1) + P(Y_2) + \cdots + P(Y_n) \\
&< e^{-c}
\end{aligned}
$$
## 占用问题

问题描述：$m$ 个球均匀独立地投入 $n$ 个箱子中，所有箱子中，球最多的那个箱子一共有多少个球？

设第 $i$ 个箱子中球的数量为 $X_i$，我们要求的就是 $\max_{1\le i\le n}X_i$。

### 简单计算

$$
\begin{aligned}
\sum_{i=1}^{n}E(X_i)
&= E(\sum_{i=1}^nX_i) = m
\end{aligned}
$$

$$
E(X_1) = E(X_2) = \cdots = E(X_n)，对称性，箱子无差别
$$

联立上式得到
$$
E(X_i) = \frac{m}{n}
$$
也就得到
$$
\max_{1\le i\le n}E(X_i) = \frac{m}{n}
$$

#### 情形 1

定理：若 $m=n$，则 $\displaystyle{\max_{1\le i\le n} X_i = O(\frac{\ln n}{\ln \ln n})}$ 高概率地（with high probability, w.h.p）成立，成立的概率为：

$$
Pr = 1 - O(\frac{1}{n^e}) \ \text{or} \ Pr = 1-o(1)
$$

首先证明单个 $X_i$ 的情况

$$
\begin{aligned}
P(X_i\ge M)
&\le P(n 个球中有 M 个球全部落入第 i 个箱子) \\
&= C_n^M(\frac{1}{n})^M \\
&= \frac{n(n-1)(n-2)\cdots(n-M+1)}{M!n^M} \\
&= \frac{1}{M!}\Pi_{k=0}^{M-1}\frac{n-k}{n} \\
&\le \frac{1}{M!} \\
&\le {\left(\frac{e}{M}\right)}^M, Stirling 公式，阶乘近似公式
\end{aligned}
$$

再证明 max 的情况

$$
\begin{aligned}
P(\max_{1\le i \le n} X_i\ge M)
&= P(\exists j: X_j \ge M) \\
&= P[(X_1\ge M) \lor \cdots \lor (X_n\ge M)] \\
&\le \sum_{j=1}^{n} P(X_j \ge M) \\
&\le n {\left(\frac{e}{M}\right)}^M
\end{aligned}
$$

令 $n {\left(\frac{e}{M}\right)}^M = \frac{1}{n}$，解得 $M \approx \frac{3\ln n}{\ln \ln n}$。而且从上式看，$M$ 越大，最终概率越小，可以扩大 $M = \frac{4\ln n}{\ln \ln n}$ 等等再做计算。总之 $\displaystyle{\max_{1\le i \le n} X_i}$ 高概率地等于 $O(\frac{\ln n}{\ln \ln n})$

##### 扩展

情形 1 可以扩展为：若 $m = \Theta(n)$，则 $\displaystyle{\max_{1\le i\le n} X_i = O(\frac{\ln n}{\ln \ln n})}$ 高概率地（with high probability, w.h.p）成立。

证明过程类似。

#### 情形 2

定理：若 $m = \Omega(n\log n)$，则 $\displaystyle{\max_{1\le i\le n} X_i = O(\frac{m}{n})}$ 高概率地成立。

> 老师未证明，待完成。

#### 总结

1. 生日悖论：单射

    将 $m$ 个球随机均匀投入 $n$ 个箱子，为确保 $f$ 是单射，至多投入 $m$ 个球
    $$
    m = \Theta(\sqrt{2n\ln \frac{1}{\epsilon}}) = \Theta(\sqrt{n})
    $$

2. 赠券收集：满射

    为确保 $f$ 是满射，至少投入 m 个球：
    $$
    m = n \ln n + O(n)
    $$

3. 最大负载

    球最多的箱子的球总数为：

    $$
    \begin{cases}
    O(\frac{\ln n}{\ln \ln n})\quad m = \Theta(n), \\
    O(\frac{m}{n})\quad m = \Omega(n \ln n)
    \end{cases}
    $$
