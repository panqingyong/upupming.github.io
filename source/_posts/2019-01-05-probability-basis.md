---
title: 概率论基础
tags:
  - 概率论
categories:
  - 数学
  - 概率论
date: 2019-01-05 19:15:22
---

本文总结了概率论的基础知识，主要是一些定义。

<!-- more -->

## 概率空间

### 事件域

**定义 1**：对于试验 $S$，样本空间为 $\Omega$，用 $F$ 表示 $\Omega$ 的某些子集构成的集合，如果 $F$ 满足下面的条件，就称之为 $\Omega$ 的**事件域**或者 **$\sigma$ 域**：

1. $\Omega \in F$
2. $A \in F \implies \bar{A} \in F$
3. $A_j \in F \implies \cup_{j=1}^nA_j \in F$

这样，我们称 $F$ 中的元素为事件，$(\Omega, F)$ 为**可测空间**。也就是说 $F$ 中的每个元素（都是集合）是可测的。

### 概率测度

补充一下测度的知识：

> 数学上，测度（Measure）是一个函数，它对一个给定集合的某些子集指定一个数，这个数可以比作大小、体积、概率等等。 传统的积分是在区间上进行的，后来人们希望把积分推广到任意的集合上，就发展出测度的概念，它在数学分析和概率论有重要的地位。

接下来在可测空间上引入概率测度。

**定义 2**：设 $(\Omega, F)$ 是可测空间，$P$ 是定义在 $F$ 上的函数，如果 $P$ 满足下面的条件，就称之为 $F$ 上的**概率测度**：

1. 非负性：$\forall A \in F, P(A) \ge 0$
2. 完全性：$P(\Omega) = 1$
3. 可列可加性：对于 $F$ 中互不相容的事件 $A_1, A_2, ...$，$P\left(\cup_{j=1}^\infty A_j\right) = \sum_{j=1}^{\infty}P(A_j)$

概率测度简称概率，我们称 $(\Omega, F, P)$ 为概率空间。

对于 $A \subset \Omega$，如果 $P(A) = 1$，就称 $A$ **以概率 1 发生**或者**几乎处处发生**，或者**几乎必然**（almost surely, 反义词是 almost never）。[维基百科](https://en.wikipedia.org/wiki/Almost_surely#Illustrative_examples) 举了几个很好的例子，比如，向边长为 1 的靶子扔飞镖，用 A 表示『击中对角线』，B 表示『不击中对角线』。A 发生的概率为 0，但是可能发生，因此叫『几乎不发生』，B 发生的概率为 1，但是可能不发生，因此叫『几乎必然』。这在连续性事件概率模型中是常见的，就像在数轴上取一个点，取中每个点的概率均为 0，但是仍然是有可能发生的。

### 将任意事件变换为不相容事件

对于任何概率测度存在的的子集 $A_1, A_2, ...$（无需互不相容），定义 $A_0 = \emptyset$，并且：

$$
B_j = A_j - \cup_{i=1}^{j-1}A_i, j = 1, 2, ...
$$

则：

1. $B_j$ 互不相容，且测度存在
2. 可列并 $\cup_{j=1}^{n}B_j = \cup_{j=1}^{n}A_j, j = 1, 2, ...$

首先证明 $B_{j_1}$ 与 $B_{j_2}$ 互不相容（不妨设 $j_1 < j_2$）：

$$
B_{j_1} \cap B_{j_2} = (A_{j_1} - \cup_{i=1}^{j_1-1}A_i) \cap (A_{j_2} - \cup_{i=1}^{j_2-1}A_i) = \emptyset
$$

结果等于空集是很显然的，因为左边的集合一定是 $A_{j_1}$ 的子集，而右边的集合又一定不包含 $A_{j_1}$ 中的任何元素。

然后证明第二条性质，采用归纳法证明：

奠基：

$$
\cup_{j=1}^1B_j = A_1 - A_0 \xlongequal{A_0 = \emptyset} A_1
$$

$$
\cup_{j=1}^2B_j = (A_2 - A_1) \cup (A_1 - A_0) \xlongequal{A_0 = \emptyset} (A_2 - A_1) \cup A_1 = A_2 \cup A_1
$$

归纳：

已知

$$
\cup_{j=1}^{k-1}B_j = \cup_{j=1}^{k-1}A_j
$$

则有：

$$
\cup_{j=1}^kB_j = \left(A_k - \cup_{j=1}^{k-1}A_j\right) \cup \left(\cup_{j=1}^{k-1}A_j\right) = \cup_{j=1}^kA_j
$$

### 概率的性质

**性质 1：**$P(A-B) = P(A) - P(B)$

证明：

$$P(A) = P(A-B+B) = P(A-B)+P(B), P(B) \ge 0$$

**性质 2：**$P(A \cup B) = P(A)+P(B)-P(A+B)$

证明：

$$P(A \cup B) = P(A+\bar{A}B) = P(A)+P(\bar{A}B) = P(A)+P(\bar{A}B)+P(AB)-P(AB) = P(A)+P(B)-P(A+B)$$

**性质 3：**$P\left(\cup_{i=1}^nA_i\right) \le \sum_{i=1}^nP(A_i)$

证明：

由性质 2 不断进行归纳即可得到。

**性质 4：**Jordan 公式：$p_k = \sum_{1 \le j_1 < j_2 < \cdots < j_k \le n }P(A_{j_1}A_{j_2}A_{j_3} \cdots A_{j_k})$，即是从 $n$ 个事件中选取 $k$ 个的概率总和。有 $P\left(\cup_{i=1}^nA_i\right) = \sum_{k=1}^n(-1)^{k-1}p_k$，便于记忆：奇整偶负。

证明：

引入**示性函数**，对于事件集合 $A$，对所有样本空间 $\Omega$ 中的元素 $\omega$，在 $A$ 中则取 1，否则取 $0$：

$$
I_A(\omega) = \begin{cases}
    1, \omega \in A \\
    0, \omega \notin A
\end{cases}
\forall \omega \in \Omega
$$

现在要证明：

$$
P\left(\cup_{i=1}^nA_i\right) = \sum_{k=1}^n(-1)^{k-1}\sum_{1 \le j_1 < j_2 < \cdots < j_k \le n }P(A_{j_1}A_{j_2}A_{j_3} \cdots A_{j_k})
$$

就是要证明：

$$
I_{\cup_{i=1}^nA_i}(\omega) = \sum_{k=1}^n(-1)^{k-1}\sum_{1 \le j_1 < j_2 < \cdots < j_k \le n }I_{A_{j_1}A_{j_2}A_{j_3} \cdots A_{j_k}}(\omega), \forall \omega \in \Omega
$$

证明过程如下：

$$
\begin{aligned}
    I_{\cup_{i=1}^nA_i}(\omega)
    &= 1 - I_{\overline{\cup_{i=1}^nA_i}}(\omega) \\
    &= 1 - I_{\cap_{i=1}^n\overline{A_i}}(\omega) \\
    &= 1 - I_{\overline{A_1}}(\omega)I_{\overline{A_2}}(\omega) \cdots I_{\overline{A_n}}(\omega) \\
    &= 1 - [1-I_{A_1}(\omega)][1-I_{A_2}(\omega)] \cdots [1-I_{A_n}(\omega)]\\
    &= l0\sum_{k=1}^n(-1)^{k-1}\sum_{1 \le j_1 < j_2 < \cdots < j_k \le n }I_{A_{j_1}A_{j_2}A_{j_3} \cdots A_{j_k}}(\omega), \forall \omega \in \Omega
\end{aligned}
$$

## 常用分布

### 泊松分布

泊松分布的概率分布为：

$$
P(X = k) = \frac{\lambda^k}{k!}e^{-\lambda}, k = 1, 2, \cdots, n, \cdots
$$

它的均值和方差分别为：

$$
E(X) = \lambda \\
D(X) = \lambda
$$

证明过程需要用到 $e^a$ 的泰勒展开：

$$
e^a = \sum_{t=0}^{\infty}\frac{a^t}{t!}
$$

$$
\begin{aligned}
    E(X)
    &= \sum_{k}kP(X=k) \\
    &= \sum_{k=0}^{\infty}k\frac{\lambda^ke^{-\lambda}}{k!} \\
    &= e^{-\lambda}\sum_{k=0}^{\infty}k\frac{\lambda^k}{k!} \\
    &= e^{-\lambda}\sum_{k=1}^{\infty}k\frac{\lambda^k}{k!} \\
    &\xlongequal{消去阶乘中的一个 k} e^{-\lambda}\sum_{k=1}^{\infty}\frac{\lambda^k}{(k-1)!} \\
    &\xlongequal{移出一个 \lambda} \lambda e^{-\lambda}\sum_{k=1}^{\infty}\frac{\lambda^{k-1}}{(k-1)!} \\
    &\xlongequal{t = k-1}\lambda e^{-\lambda}\sum_{t=0}^{\infty}\frac{\lambda^{t}}{t!} \\
    &= \lambda e^{-\lambda}e^{\lambda} = \lambda
\end{aligned}
$$

$$
\begin{aligned}
    D(X)
    &= E|(X-\mu)^2| \\
    &= \sum_{k}(k-\mu)^2P(X=k) \\
    &=
\end{aligned}
$$

发现应算算不下去，改用：

$$
D(X) = E(X^2) - [E(X)]^2 \\
$$

$$
\begin{aligned}
    E(X^2)
    &= \sum_{k}k^2P(X=k) \\
    &= \sum_{k=0}^{\infty}k^2\frac{\lambda^ke^{-\lambda}}{k!} \\
\end{aligned}
$$

发现 $k^2$ 不太好消，改用 $k(k-1)$：

$$
\begin{aligned}
    E[X(X-1)]
    &= \sum_{k=0}^{\infty}k(k-1)\frac{\lambda^ke^{-\lambda}}{k!} \\
    &= e^{-\lambda}\sum_{k=2}^{\infty}\frac{\lambda^k}{(k-2)!} \\
    &= \lambda^2e^{-\lambda}\sum_{t=0}^{\infty}\frac{\lambda^t}{t!} \\
    &= \lambda^2 e^{-\lambda} e^{\lambda} \\
    &= \lambda^2
\end{aligned}
$$

$$
E(X^2) - E(X) = \lambda^2
$$

$$
E(X^2) = \lambda^2 + \lambda
$$

$$
D(X) = E(X^2) - [E(X)]^2 = \lambda^2 + \lambda - \lambda^2 = \lambda
$$

## 练习

### 维纳过程

$W(t)$ 是 $c^2 = \sigma^2$ 的维纳过程，$X(t) = W^2(t)$。

则有均值函数

$$
\begin{aligned}
    m_X(t)
    &= E\{W^2(t)\} = D[W(t)] + E[W(t)]^2 \\
    &\xlongequal{这里假设 W(0) = 0, 则 W(t) \sim N(0, \sigma^2t)} \sigma^2t
\end{aligned}
$$

自相关函数

$$
\begin{aligned}
    R_X(s, t)
    &= E\{W^2(s)W^2(t)\}, 假设 s > t \\
    &\xlongequal{想办法利用独立增量过程的性质} E\{[W(s)-W(t) + W(t)]^2 \cdot W^2(t)\} \\
    &= E\left\{\left[W(s)-W(t)\right]^2W^2(t) + 2\left[W(s)-W(t)\right]W^3(t) + W^4(t)\right\} \\
    &= E\left\{\left[W(s)-W(t)\right]^2\right\} \cdot E\left[W^2(t)\right] + 2E\left[W(s)-W(t)\right] \cdot E[W^3(t)] + E[W^4(t)] \\
    &= \sigma^2(s-t) \cdot \sigma^2t + 0 + E[W^4(t)]
\end{aligned}
$$

单独来计算一下 $E[W^4(t)]$，可以参考 [Proving E[X4]=3σ4](https://math.stackexchange.com/questions/1917647/proving-ex4-3%CF%834)，因为：

$$
\begin{aligned}
    W(t) - W(0) &\sim N(0, \sigma^2t) \\
    W(t) &\sim N(0, \sigma^2 t)
\end{aligned}
$$

有：

$$
f_{W(t)}(x) = \frac{1}{\sqrt{2\pi \sigma^2 t}}\exp\left\{-\frac{x^2}{2\sigma^2 t}\right\}
$$

进而：

$$
\begin{aligned}
    E[W^4(t)]
    &= \int_{-\infty}^{+\infty}f_{W(t)}(x) \cdot x^4 dx \\
    &= \int_{-\infty}^{+\infty} \frac{x^4}{\sqrt{2\pi \sigma^2 t}}\exp\left\{-\frac{x^2}{2\sigma^2 t}\right\} dx \\
    &= \int_{-\infty}^{+\infty} \frac{x^3}{2\sqrt{2\pi \sigma^2 t}}\exp\left\{-\frac{x^2}{2\sigma^2 t}\right\} dx^2 \\
    &= \int_{-\infty}^{+\infty} -\frac{x^3 \sqrt{\sigma^2 t}}{\sqrt{2\pi}}\exp\left\{-\frac{x^2}{2\sigma^2 t}\right\} d\left[-\frac{x^2}{2\sigma^2 t}\right] \\
    &= \int_{-\infty}^{+\infty} -\frac{x^3 \sqrt{\sigma^2 t}}{\sqrt{2\pi}} d\exp\left\{-\frac{x^2}{2\sigma^2 t}\right\} \\
    &\xlongequal{分部积分} \left\{-\frac{x^3 \sqrt{\sigma^2 t}}{\sqrt{2\pi}} \cdot \exp\left\{-\frac{x^2}{2\sigma^2 t}\right\}\right\}\Bigg|_{-\infty}^{+\infty}-
    \int_{-\infty}^{+\infty} \exp\left\{-\frac{x^2}{2\sigma^2 t}\right\} d\left\{-\frac{x^3 \sqrt{\sigma^2 t}}{\sqrt{2\pi}}\right\}\\
    &= \int_{-\infty}^{+\infty} \frac{3x^2 \sqrt{\sigma^2 t}}{\sqrt{2\pi}}\exp\left\{-\frac{x^2}{2\sigma^2 t}\right\} dx \\
    &= \int_{-\infty}^{+\infty} \frac{3x \sqrt{\sigma^2 t}}{2\sqrt{2\pi}}\exp\left\{-\frac{x^2}{2\sigma^2 t}\right\} dx^2 \\
    &= \int_{-\infty}^{+\infty} -\frac{3x \sigma^2 t \sqrt{\sigma^2 t}}{\sqrt{2\pi}}\exp\left\{-\frac{x^2}{2\sigma^2 t}\right\} d\left[-\frac{x^2}{2\sigma^2 t}\right] \\
    &= \int_{-\infty}^{+\infty} -\frac{3x \sigma^2 t \sqrt{\sigma^2 t}}{\sqrt{2\pi}} d\exp\left\{-\frac{x^2}{2\sigma^2 t}\right\} \\
    &\xlongequal{分部积分} \left\{-\frac{3x \sigma^2 t \sqrt{\sigma^2 t}}{\sqrt{2\pi}} \cdot \exp\left\{-\frac{x^2}{2\sigma^2 t}\right\}\right\}\Bigg|_{-\infty}^{+\infty} - \int_{-\infty}^{+\infty} \exp\left\{-\frac{x^2}{2\sigma^2 t}\right\} d \left[-\frac{3x \sigma^2 t \sqrt{\sigma^2 t}}{\sqrt{2\pi}}\right] \\
    &= -\int_{-\infty}^{+\infty}-\frac{3 \sigma^2 t \sqrt{\sigma^2 t}}{\sqrt{2\pi}}\exp\left\{-\frac{x^2}{2\sigma^2 t}\right\} dx \\
    &= 3\sigma^4t^2 \int_{-\infty}^{+\infty}\frac{1}{\sqrt{2\pi \sigma^2 t}} \exp\left\{-\frac{x^2}{2\sigma^2 t}\right\} dx \\
    &= 3\sigma^4t^2
\end{aligned}
$$

这里用到了 [Gaussian integral](https://en.wikipedia.org/wiki/Gaussian_integral)：

$$
{\displaystyle \int _{-\infty }^{\infty }e^{-x^{2}}\,dx={\sqrt {\pi }}}
$$

$$
{\displaystyle \int _{-\infty }^{\infty }e^{-(\frac{x}{\sqrt{2\sigma^2t}})^{2}}\,d\frac{x}{\sqrt{2\sigma^2t}}={\sqrt {\pi }}}
$$

$$
\frac{1}{\sqrt{2\sigma^2t}}{\displaystyle \int _{-\infty }^{\infty }e^{-(\frac{x}{\sqrt{2\sigma^2t}})^{2}}\,dx={\sqrt {\pi }}}
$$

$$
{\displaystyle \int _{-\infty }^{\infty }e^{-(\frac{x}{\sqrt{2\sigma^2t}})^{2}}\,dx={\sqrt {\pi }}\sqrt{2\sigma^2t}}
$$

<!-- ### 样本点

今天同学问了我一个特别有意思的问题，『样本点』到底是啥？

先从随机过程的定义说起 -->

### 复随机过程

已知实随机过程 $X(t)$ 具有自相关函数 $R_X(s, t)$，令

$$
Y(t) = X(t+a) - X(t)
$$

求 $R_Y(s, t)$：

$$
\begin{aligned}
    R_Y(s, t)
    &= E\left[
    Y(s)\overline{Y(t)}
    \right] \\
    &= E\left\{
    [X(s+a) - X(s)][X(t+a) - X(t)]
    \right\} \\
    &= E\left[
    X(s+a)X(t+a) - X(s+a)X(t) - X(s)X(t+a) + X(s)X(t)
    \right] \\
    &= R_X(s+a, t+a) - R_X(s+a, t) - R_X(s, t+a) + R_X(s, t) \\
\end{aligned}
$$

### 二阶矩过程

二阶矩过程的均值函数和相关函数必然存在。

**定义：** 随机过程 $\{X(t), t \in T\}$，如果 $\forall t \in T, E[X^2(t)] < \infty$，则称 $\{X(t), t \in T\}$ 是二阶矩过程。

$$
\begin{aligned}
    \left\{E[X(t)]\right\}^2
    &= E[X^2(t)] - D[X(t)] \\
    &< \infty
\end{aligned}
$$

所以：

$$
E[X(t)] < \infty
$$

均值函数存在。

$$
\begin{aligned}
    R(s, t)
    &= E[X(s)X(t)] \\
    &= ... \\
\end{aligned}
$$

这里需要用到柯西不等式：

$$
\begin{aligned}
    (u \cdot v)^2 \le (u \cdot u)(v \cdot v) \\
    \left(\sum_{i=1}^{n}x_iy_i\right)^2 \le \sum_{i=1}^{n}x_i^2 \sum_{j=1}^{n}y_j^2 \\
    \left(\int_a^bf \cdot gdx\right)^2 \le \int_a^bf^2dx\int_a^bg^2dx
\end{aligned}
$$

回到上面的式子继续证明，我们用到第二个柯西不等式，有：

$$
E^2(XY) \le E(X^2)E(Y^2)
$$

$$
\begin{aligned}
    R(s, t)
    &= E[X(s)X(t)] \\
    &\le \left\{
        E[X^2(s)]E[X^2(t)]
        \right\}^\frac{1}{2} \\
    &< \infty
\end{aligned}
$$

所以自相关函数存在。

在随机过程是二阶矩的前提之下，相关函数 $R_X(s, t)$ 具有以下性质：

1. 共轭对称性

   $$
   \overline{R_X(s, t)} = R_X(t, s), s, t \in T
   $$

   很显然，因为存在，所以相等

2. 非负定性

   对 $\forall n \ge 1, \forall t_1, \cdots, t_n \in T$ 和 $\forall \lambda_1, \cdots, \lambda_n$，有：

   $$
   \sum_{k=1}^{n}\sum_{l=1}^{n}R_X(t_k, t_l)\lambda_k\overline{\lambda_l} \ge 0
   $$

   证明：

   $$
   \begin{aligned}
       & \sum_{k=1}^{n}\sum_{l=1}^{n}R_X(t_k, t_l)\lambda_k\overline{\lambda_l} \\
       =& \sum_{k=1}^{n}\sum_{l=1}^{n}E\left[X(t_k)\lambda_k\overline{X(t_l)\lambda_l}\right] \\
       =& E\left[\sum_{k=1}^{n}\sum_{l=1}^{n}X(t_k)\lambda_k\overline{X(t_l)\lambda_l}\right] \\
       =& E\left[\left[\sum_{k=1}^{n}X(t_k)\lambda_k\right]\left[\sum_{l=1}^{n}\overline{X(t_l)\lambda_l}\right]\right] \\
       =& E\left[\left[\sum_{k=1}^{n}X(t_k)\lambda_k\right]\overline{\left[\sum_{l=1}^{n}X(t_l)\lambda_l\right]}\right] \\
       =& E\left[\left|\sum_{k=1}^{n}X(t_k)\lambda_k\right|^2\right] \\
   \end{aligned}
   $$
