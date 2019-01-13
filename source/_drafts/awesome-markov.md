---
title: awesome-markov
tags:
---

- [tags:](#tags)
- [具体的例子](#%E5%85%B7%E4%BD%93%E7%9A%84%E4%BE%8B%E5%AD%90)
- [习题](#%E4%B9%A0%E9%A2%98)
  - [常返态 vs 滑过态](#%E5%B8%B8%E8%BF%94%E6%80%81-vs-%E6%BB%91%E8%BF%87%E6%80%81)
  - [转移概率矩阵](#%E8%BD%AC%E7%A7%BB%E6%A6%82%E7%8E%87%E7%9F%A9%E9%98%B5)
  - [一致连续、极限性质](#%E4%B8%80%E8%87%B4%E8%BF%9E%E7%BB%AD%E6%9E%81%E9%99%90%E6%80%A7%E8%B4%A8)
- [熵与相对熵](#%E7%86%B5%E4%B8%8E%E7%9B%B8%E5%AF%B9%E7%86%B5)
- [隐马尔科夫模型](#%E9%9A%90%E9%A9%AC%E5%B0%94%E7%A7%91%E5%A4%AB%E6%A8%A1%E5%9E%8B)
  - [前向变量](#%E5%89%8D%E5%90%91%E5%8F%98%E9%87%8F)
  - [后向变量](#%E5%90%8E%E5%90%91%E5%8F%98%E9%87%8F)
- [Kolmogorov 向前方程与向后方程](#kolmogorov-%E5%90%91%E5%89%8D%E6%96%B9%E7%A8%8B%E4%B8%8E%E5%90%91%E5%90%8E%E6%96%B9%E7%A8%8B)

一切与马尔科夫有关的东西。

1. 状态空间有限或者可列
2. 是一种离散时间随机过程
3. 具有马尔科夫性质（无后效性）。即在给定当前知识或信息的情况下，过去对于预测未来是无关的。

<!-- more -->

## 具体的例子

- 在数字通讯模型中，$X_n$ 表示第 $n$ 级的输出信号。
- 在抛硬币的实验中，$X_n$ 表示第 $n$ 次总计的正面次数。
- 传染病患病模型中， $X_n$ 表示时刻 $n$ 的患病人数

## 习题

### 常返态 vs 滑过态

设马氏链 $\{X_n, n \ge 0\}$ 的状态空间 $I = \{1, 2, 3, 4\}$，转移概率矩阵为：

$$
P = \begin{pmatrix}
    \frac{1}{4} & 0 & \frac{1}{4} & \frac{1}{2} \\
    0 & \frac{1}{2} & \frac{1}{2} & 0 \\
    0 & 1 & 0 & 0 \\
    0 & 0 & 0 & 1 \\
\end{pmatrix}
$$

判断各状态的常返性。

关于常返态和瞬时态可以看一下 [Transience and Recurrence of Markov Chains](https://brilliant.org/wiki/transience-and-recurrence/)。

经过有限步转移后，迟早从状态 $i$ 返回状态 $i$ 的概率为：

$$
f_{ii} = \sum_{1 \le n < \infty} f_{ii}^{(n)} = \sum_{1 \le n < \infty}P\{T_{ii}=n|X_0=i\} = P\{T_{ii} < \infty\}
$$

- $f_{ii} = 1$: 状态 $i$ 称为常返态，从状态 $i$ 出发，一定会返回状态 $i$。
- $f_{ii} < 1$: 状态 $i$ 称为滑过态，从状态 $i$ 出发，有 $1-f_{ii}$ 的概率永远也回不到状态 $i$。

$f_{ii} = 1$ 等价于会无穷次返回状态 $i$。否则，可能一次也不会返回状态 $i$。

从状态转移矩阵我们可以看到：

1. 状态 1 有 $\frac{1}{2}$ 的概率转移到状态 4，然后就再也回不来了，所以其为滑过态。
2. 状态 2 有 $\frac{1}{2}$ 的概率留在状态 1，有 $\frac{1}{2}$ 的概率转移到状态 3，然而状态 3 只能返回状态 2，因此状态 2 就是常返态。
3. 状态 3 只能进入状态 2，为滑过态。
4. 状态 4 只能留在状态 4，为常返态。

### 转移概率矩阵

已知转移概率矩阵：

$$
P = \begin{pmatrix}
    0 & p_{12} & p_{13} \\
    p_{21} & 0 & p_{22} \\
    p_{31} & p_{32} & 0
\end{pmatrix}
$$

从状态 1 出发，经过 $n$ 步转移首次到达各状态的概率分别为：

$$
\begin{aligned}
    f_{11}^{(n)} \xlongequal{前 (n-1) 步只能在状态 2、3}& \begin{cases}
    p_{12}p_{23} \cdots p_{23} p_{32} p_{21} + p_{13}p_{32} \cdots p_{32} p_{23} p_{31}, n 为偶数 \\
    p_{12}p_{23} \cdots p_{23} p_{31} + p_{13}p_{32} \cdots p_{32} p_{21}, n 为奇数 \\
\end{cases} \\
=& \begin{cases}
    (p_{23}p_{32})^{\frac{n}{2}-1}(p_{12}p_{21} + p_{13}p_{31}), n 为偶数 \\
    (p_{23}p_{32})^{\frac{n-1}{2}-1} (p_{12}p_{23}p_{31}+ p_{13}p_{32}p_{21}), n 为奇数
\end{cases}
\end{aligned}
$$

$$
f_{12}^{(n)} \xlongequal{前 (n-1) 步只能在状态 1、3} \begin{cases}
    p_{13}p_{31} \cdots p_{13} p_{32}, n 为偶数 \\
    p_{13}p_{31} \cdots p_{31} p_{12}, n 为奇数 \\
\end{cases}
$$

$$
f_{13}^{(n)} \xlongequal{前 (n-1) 步只能在状态 1、2} \begin{cases}
    p_{12}p_{21} \cdots p_{12} p_{23}, n 为偶数 \\
    p_{12}p_{21} \cdots p_{21} p_{13}, n 为奇数 \\
\end{cases}
$$

### 一致连续、极限性质

例考察由 n 个部件组成的系统，其中部件 i(i=1,...,n)按照速率为 $λ_i$ 运行一个指数时间，然后失效。在它失效时，对部件 i 的修理开始，修理需要用一个速率为 $μ_i$ 的指数分布时间。部件一旦修复，将与新的同样好，部件运行是彼此独立的，除了当只有一个部件工作时系统将暂时停止直到完成一次修复，然后以两个部件重新运行。

1. 系统停止的时间比例是多少？
2. 正在修理的部件的平均个数是多少？

部件的状态：0 表示失效，1 表示正常。它是一个时间可逆的过程。

转移概率矩阵不好求。

极限分布是按照平均时间（每运行 $\lambda$ 时间，暂停 $\mu_i$ 时间）进行计算的结果：

$$
(\frac{\mu_i}{\lambda_i + \mu_i}, \frac{\lambda_i}{\lambda_i + \mu_i})
$$

## 熵与相对熵

引入熵的目的在于刻画一个离散分布或一个分布密度的不确定性大小。也就是说知道了此随机变量的取值所获得的信息的大小。

离散分布 $p = (p_1, \cdots, p_n, \cdots)$ 的熵被定义为：

$$
H(p) = - \sum_i p_i \ln p_i
$$

又定义分布 $p$ 关于分布 $q = (q_1, \cdots, q_n, \cdots)$ 的 Kullback Leibler 相对熵为：

$$
h(p, q) = \sum_i p_i\ln \frac{p_i}{q_i}
$$

$$
h(p, q) = 0 \iff p = q
$$

分布密度 $p(x)$ 的熵为：

$$
H(p) = -\int p(x)\ln p(x)dx
$$

分布密度 $p(x)$ 对分布密度 $q(x)$ 的相对熵为：

$$
h(p, q) = \int p(x)\frac{p(x)}{q(x)}dx
$$

推广到多维密度 $p(x_1, \cdots, x_d)$ 与 $q(x_1, \cdots, x_d)$：

$$
H(p, q) = -\int p(x_1, \cdots, x_d)\ln p(x_1, \cdots, x_d) dx_1x_2\cdots x_d
$$

$$
h(p, q) = \int p(x_1, \cdots, x_2)\ln \frac{p(x_1, \cdots, x_d)}{q(x_1, \cdots, x_d)}dx_1x_2\cdots x_d
$$

## 隐马尔科夫模型

初始状态概率 $\pi = (\pi_1, \cdots, \pi_N)$：

$$
\pi_i = P(q_1 = \theta_i), 1 \le i \le N
$$

状态转移概率矩阵 $P = (a_{ij})_{N\times N}$：

$$
a_{ij} = P(q_{t+1}=\theta_j | q_t = \theta_i), 1 \le i,j \le N
$$

观察概率序列 $B = (b_1(o), b_2(o), \cdots, b_N(o))$

一个 HMM（马尔科夫模型） 的参数组为：

$$
\lambda = (\pi, A, B)
$$

三个基本问题：

1. 已知 $\lambda = (\pi, A, B)$ 的，计算观测序列 $O = (o_1, o_2, \cdots, o_T)$ 在给定模型 $\lambda$ 的条件下的概率 $P(O | \lambda)$。
2. 确定最佳状态序列 $Q = (q_1, q_2, \cdots, q_T)$，以最好的解释观察序列 $O$。
3. 给定一个观测序列的集合，如何调整模型参数 $\lambda$，以使 $P(O|\lambda)$ 达到最大值。

计算概率 $P(O|\lambda)$：

先计算 $P(O, Q | \lambda)$，其中隐状态 $Q = (q_1, q_2, \cdots, q_T)$：

$$
\begin{aligned}
    P(O, Q | \lambda)
    &= P(O | Q, \lambda)P(Q|\lambda)
\end{aligned}
$$

这其中：

$$
\begin{aligned}
    P(O|Q, \lambda) \xlongequal{每个时刻的显状态只受当前隐状态的影响}& \prod_{t=1}^TP(o_t|q_t) \\
    =& b_{q_1}(o_1)b_{q_2}(o_2) \cdots b_{q_T}(o_T)
\end{aligned}
$$

$$
P(Q|\lambda) = \pi_{q1}a_{q_1q_2} \cdots a_{q_{T-1}q_{T}}
$$

$$
P(O, Q|\lambda) = \pi_{q_1}b_{q_1}(o_1)a_{q_1q_2}b_{q_2}(o_2) \cdots a_{q_{T-1}q_T}b_{q_T}(o_T)
$$

然后遍历所有的隐状态 $Q$ 作和：

$$
\begin{aligned}
    P(O|\lambda)
    &= \sum_{\forall Q}P(O, Q|\lambda) \\
    &= \sum_{\forall Q}\pi_{q_1}b_{q_1}(o_1)a_{q_1q_2}b_{q_2}(o_2) \cdots a_{q_{T-1}q_T}b_{q_T}(o_T)
\end{aligned}
$$

直接计算的话，计算量为 $2TN^T$，可以理解为有 $N^T$ 种可能的隐状态，每种隐状态又有 $2T$ 个乘积计算。当 $N=5, T=100$ 时，计算量达到 $10^{72}$。

利用前向-后向算法解决计算量问题。

### 前向变量

定义前向变量为：$\alpha_t(i) = P(o_1o_2 \cdots o_t, q_t = i|\lambda)$，物理意义是在 $t$ 时刻隐状态为 $i$ ，而且观测序列为 $o_1o_2 \cdots o_t$ 的概率。

利用前向变量可以更加简单地计算出现当前的观测的概率 $P(O|\lambda)$。

前向变量具有如下性质：

1. 初值易求：$\alpha_1(i) = P(o_1, q_1 = i) = \pi_i b_i(o_1)$，在 $1$ 时刻隐状态为 $i$。
2. 可以计算 $P(O|\lambda)$：$P(O|\lambda) = \sum_{i=1}^N \alpha_T(i)$，在 $T$ 时刻的隐状态 $q_T = i$ 可能有 $N$ 种情况
3. 有递推关系，逐层递推，计算出全部的 $\alpha_t(j), 1 \le t \le T-1, 1 \le j \le N$，最后再由 $\alpha_T(i)$ 计算得到 $P(O|\lambda)$。

![20190107014651.png](https://i.loli.net/2019/01/07/5c323f12d0c0f.png)

初始化：

对 $1 \le i \le N$：

$$
\alpha_1(i) = P(o_1, q_1=i) = \pi_ib_i(o_1)
$$

递推：

对 $1 \le t \le T-1, 1 \le j \le N$

$$
\begin{aligned}
    \alpha_{t+1}(j)
    &= \left[
    \sum_{i=1}^N\alpha_t(i)\alpha_{ij}
    \right]b_j(o_{t+1}), 在 t 时刻的隐状态 q_t = i 可能有 N 种情况，都转移到 j \\
\end{aligned}
$$

终止：

$$
P(O|\lambda) = \sum_{i=1}^N\alpha_T(i)
$$

在 $T$ 时刻的隐状态 $q_T = i$ 可能有 $N$ 种情况。

$T$ 次递推，每次递推需要计算 $N$ 个前向变量，每个前向变量需要 $N$ 次计算，因此总的计算量为 $N^2T$。

### 后向变量

定义后向变量为：$\beta_t(i) = P(o_{t+1}, o_{t+2}, \cdots, o_T|q_t = i, \lambda)$，物理意义是：在 $t$ 时刻隐状态是 $i$ 的条件之下，出现观测序列 $o_{t+1}, o_{t+2}, \cdots, o_T$ 的概率。注意到这里的 $q_t = i$ 作为条件了，这是与前向变量定义的很大的区别。

性质有：

1. 初值 $\beta_T(i) = 1$
2. 递推关系 $\beta_{t}(i) = \sum_{j=1}^Na_{ij}b_j(o_{t+1})\beta_{t+1}(j)$
3. 可以计算观测结果概率 $P(O|\lambda) = \sum_{j=1}^N\alpha_t(j)\beta_t(j)$

![20190107015632.png](https://i.loli.net/2019/01/07/5c3241536428b.png)

运算量仍然是 $O(TN^2)$。

## Kolmogorov 向前方程与向后方程

**Kolmogorov 向后方程：** 假设 $q_{ii} = \sum_{k \mathbin{\mathrlap{\,/}{=}}i }q_{ik}$，则对一切 $i, j$ 及 $t \ge 0$，有：

$$
p'_{ij}(t) = \sum_{k \mathbin{\mathrlap{\,/}{=}}i}q_{ik}p_{kj}(t) - q_{ii}p_{ij}(t) = Q_iP_j
$$

写成矩阵的形式就是：

$$
\begin{pmatrix}
    p'_{11}(t) & p'_{12}(t) & \cdots & p'_{1j}(t) & \cdots & p'_{1n}(t) \\
    \vdots & \vdots & \vdots & \vdots & \vdots & \vdots \\
    p'_{i1}(t) & p'_{i2}(t) & \cdots & p'_{ij}(t) &  \cdots & p'_{in}(t) \\
    \vdots & \vdots & \vdots & \vdots & \vdots & \vdots \\
    p'_{n1}(t) & p'_{n2}(t) & \cdots & p'_{nj}(t) & \cdots & p'_{nn}(t) \\
\end{pmatrix} \\ \\ = \begin{pmatrix}
    -q_{11}(t) & q_{12}(t) & \cdots & q_{1j}(t) &  \cdots & q_{1n}(t) \\
    \vdots & \vdots & \vdots & \vdots & \vdots & \vdots \\
    q_{i1}(t) & q_{i2}(t) & \cdots & q_{ij}(t) &  \cdots & q_{in}(t) \\
    \vdots & \vdots & \vdots & \vdots & \vdots & \vdots \\
    q_{n1}(t) & -q_{n2}(t) & \cdots & q_{nj}(t) &  \cdots & -q_{nn}(t) \\
\end{pmatrix}
\begin{pmatrix}
    p_{11}(t) & p_{12}(t) & \cdots & p_{1j}(t) &  \cdots & p_{1n}(t) \\
    \vdots & \vdots & \vdots & \vdots & \vdots & \vdots \\
    p_{i1}(t) & p_{i2}(t) & \cdots & p_{ij}(t) &  \cdots & p_{in}(t) \\
    \vdots & \vdots & \vdots & \vdots & \vdots & \vdots \\
    p_{n1}(t) & p_{n2}(t) & \cdots & p_{nj}(t) &  \cdots & p_{nn}(t) \\
\end{pmatrix}
$$

证明：

由切普曼-切尔莫哥洛夫方程有：

$$
\begin{aligned}
    p_{ij}(t+h)
    &= \sum_{k \in I}p_{ik}(h)p_{kj}(t) \\
    &= \sum_{k \mathbin{\mathrlap{\,/}{=}} i}p_{ik}(h)p_{kj}(t) + p_{ii}(h)p_{ij}(t) \\
\end{aligned}
$$

两边减去同样的值，并令时间差趋于 0：

$$
p_{ij}(t+h) - p_{ij}(t) = \sum_{k \mathbin{\mathrlap{\,/}{=}} i}p_{ik}(h)p_{kj}(t) - [1-p_{ii}(h)]p_{ij}(t)
$$

$$
\begin{aligned}
    p'_{ij}(t)
    &= \lim_{h \to 0} \frac{p_{ij}(t+h) - p_{ij}(t)}{h} \\
    &= \lim_{h \to 0} \sum_{k \mathbin{\mathrlap{\,/}{=}} i} \frac{p_{ik}(h)}{h}p_{kj}(t) - \lim_{h \to 0}\frac{1-p_{ii}(h)}{h}p_{ij}(t) \\
    &= \sum_{k \mathbin{\mathrlap{\,/}{=}} i}q_{ik}p_{kj}(t) - q_{ii}p_{ij}(t)
\end{aligned}
$$

向后方程的矩阵形式也可以写为：

$$
P'(t) = QP(t)
$$

向前方程的矩阵形式则为：

$$
P'(t) = P(t)Q
$$

表达式为：

$$
p'_{ij}(t) = \sum_{k \mathbin{\mathrlap{\,/}}{=}j}p_{ik}(t)q_{kj} - p_{ij}(t)q_{jj}
$$

## 维纳过程

1. $W(t)$ 是独立增量过程
2. $\forall s, t > 0, W(s+t) - W(s) \sim N(0, c^2t)$
3. $W(t)$ 是关于 $t$ 的连续函数

那么 $\{W(t); t \ge 0\}$ 就是布朗运动或者维纳过程。

标准维纳过程：$c = 1, W(0) = 0$，记为 $\{W_0(t); t \ge 0\}$，那么有：

- $W_0(t) \sim N(0, t)$
- $W_0(t_i) - W_0(t_{i-1}) \sim N(0, t_i - t_{i-1})$

标准维纳过程的一维概率密度函数为：

$$
f_t(x) = \frac{1}{\sqrt{2\pi c}}\exp\{-\frac{x^2}{2t}\}
$$

维纳过程是正态过程，因为：

$$
\begin{cases}
    W(t_1) &= W(t_1) - 0 \\
    W(t_2) &= [W(t_2) - W(t_1)] + [W(t_1) - 0] \\
    W(t_3) &= [W(t_3) - W(t_2)] + [W(t_2) - W(t_1)] + [W(t_1) - 0] \\
    & \vdots \\
\end{cases}
$$

标准维纳过程的互相关函数，自变量满足 $0 < s < t$：

$$
\begin{aligned}
    R_{W_0}(s, t)
    &= E\{W_0(s)W_0(t)\} \\
    &\xlongequal{构造独立增量} E\{W_0(s) [W_0(t) - W_0(s) + W_0(s)]\} \\
    &= E\{W^2_0(s)\} \\
    &= D[W_0(s)] + E[W_0(s)]^2 \\
    &= s + 0 = s
\end{aligned}
$$

推广到普通情况有：

$$
R_{W_0}(s, t) = \min(s, t)
$$

当 $s= t$ 时，标准维纳过程的相关函数是一个连续函数，因此标准维纳过程是均方连续的随机过程。

$$
R(s, t) = \begin{cases}
    s, s < t \\
    t, s > t
\end{cases}
$$

$$
\frac{\partial R(s, t)}{\partial s} = \begin{cases}
    1, s < t \\
    0, s > t
\end{cases}
= u (t-s)
$$

记维纳标准过程的均方导数为 $W'_0(t)$，则有：

$$
E\{W'_0(s)W'_0(t)\} = \frac{\partial R_{W_0}(s, t)}{\partial s\partial t}, 求导与积分换序
$$

$$
E\{W'_0(s)W'_0(t)\} = \frac{\partial u(t-s)}{\partial t} = \delta(\tau), \tau = s - t
$$

$W_0(t)$ 是一个正态分布的白噪声。

### 白噪声的均方积分

白噪声 $\xi(t)$ 服从正态分布。研究其均方积分 $\{\eta(t) = \int_0^{t}\xi(u)du; t \ge 0\}$ 的统计特性。

白噪声随机过程：

$$
E\{\xi(t)\} = 0 \\
R_{\xi}(\tau) = \sigma^2 \delta(\tau)
$$

均方积分是线性变换，正态过程的线性变换仍然是正态过程。

$$
\begin{aligned}
    E\left\{
    \eta(t)
\right\}
&= E\left\{
    \int_0^{t}\xi(u)du
\right\} \\
&= \int_0^{t} E\left\{
    \xi(u)
\right\}du \\
&= 0
\end{aligned}
$$

$$
\begin{aligned}
R_{\eta}(t_1, t_2)
&= E\left\{
    \eta(t_1)\eta(t_2)
\right\} \\
&= E\left\{
    \int_0^{t_1}\xi(u)du\int_0^{t_2}\xi(v)dv
\right\} \\
&= E\left\{
    \int_0^{t_1}\xi(u)du\int_0^{t_2}\xi(v)dv
\right\} \\
&= E\left\{
    \int_0^{t_1}\int_0^{t_2}\xi(u)\xi(v)dudv
\right\} \\
&= \int_0^{t_1}\int_0^{t_2}E\left\{
    \xi(u)\xi(v)
\right\}dudv \\
&= \int_0^{t_1}\int_0^{t_2}
    R_{\xi}(u-v)
dudv \\
&\xlongequal{白噪声的自相关函数为冲激函数} \int_0^{t_1}\int_0^{t_2}
    \sigma^2\delta(u-v)
dudv \\
&\xlongequal{假定 t_1 \le t_2} \int_0^{t_1}\sigma^2dv = \sigma^2t_1
\end{aligned}
$$

推广到一般情况就有：正态分布的高斯白噪声 $\xi(t)$ 的均方积分 $\eta(t) = \int_0^t\xi(u)du$ 的自相关函数为：

$$
R_{\eta}(t_1, t_2) = \sigma^2\min(t_1, t_2)
$$

相通地，有维纳过程的导数为正态分布的白噪声。

确定性函数 $b(t)(t \ge 0)$ 满足绝对可积：

$$
\int_{0}^{t}|b(u)|^2du < \infty, \forall t \ge 0
$$

划分区间，并做和，得到：

$$
S_n = \sum_{k=0}^{n-1}b(t_k) [W_0(t_{k+1}) - W_0(t_k)]
$$

称 $S_n$ 的均方极限为维纳积分：

$$
U(t) = \int_0^tb(u)dW_0(u)
$$

可以证明，$S_n$ 的均方极限一定存在。并且有以下的结果：

$$
E[U(t)] = E\{
    \int_0^t b(u) dW_0(u)
    \} = 0
$$

$$
\begin{aligned}
    R_U(t_1, t_2)
    &= E\{
    \int_0^{t_1}b(u)dW_0(u) \int_0^{t_2}b(v)dW_0(v)
    \} \\
    &= \int_0^{\min(t_1, t_2)} b^2(u)du
\end{aligned}
$$

例题：试研究维纳积分：

$$
U(t) = \int_0^t \sin (\omega u) dW_0(u)
$$

维纳积分的形式，要验证积分的存在性，并且利用已有的结论套一下公式就好。

存在性，证明平方可积：

$$
\int_0^t \sin^2(\omega u)du < \infty
$$

均值：

$$
E[U(t)] = 0
$$

方差：

$$
\begin{aligned}
    R_U(t_1, t_2)
    &= \int_0^{\min(t_1, t_2)} \sin^2(\omega u) du \\
    &= \int_0^{\min(t_1, t_2)} (\frac{1}{2} - \frac{1}{2}\cos(2\omega u))du \\
    &= \frac{1}{2}\min(t_1, t_2) - \frac{1}{4\omega} \sin\{2\omega[\min(t_1, t_2)]\}
\end{aligned}(t_1 \ge 0, t_2 \ge 0)
$$

维纳过程是一正态过程，那么维纳积分就是正态分布的随机变量。（正态过程的积分仍然是正态分布）

维纳过程是独立增量过程，如果已知 $W(0) = 0$，那么就可以得到：

对任意的 $t_1 < t_2 \cdots < t_n$

$$
W(t_1) = W(t_1) - W(0), W(t_2) - W(t_1), \cdots, W(t_n) - W(t_{n-1})
$$

相互独立

现在如果不给定 $W(0) = 0$，那么是得不到上面的独立条件的，如果假设有 $W(x) = 0$（不一定有，这里只是假设），则必须要满足 $x < t_1$ 才可以使用独立增量条件：

$$
W(t_1) = W(t_1) - W(x), W(t_2) - W(t_1), \cdots, W(t_n) - W(t_{n-1})
$$

相互独立

### 复合泊松分布

设顾客按参数为 $\lambda$ 的泊松过程进入一个商店，$Y$ 表示第 $i$ 个顾
客所花的钱数， $X(t)$ 表示 $[0,t]$ 内顾客在此商店的总消费。则：

$$
X(t) = \sum_{i=0}^{N(t)}Y = N(t)Y
$$

求其均值和方差：

$$
\begin{aligned}
E[X(t)]
&= E\left[N(t)Y\right] \\
&= E[N(t)]E[Y] \\
\end{aligned}
$$

$$
\begin{aligned}
D[X(t)]
&= D\left[N(t)Y\right] \\
&= D[N(t)]D[Y] \\
\end{aligned}
$$

独立变量方差之积：

$$
\begin{aligned}
    D(AB)
    &= E[(AB)^2] - E^2[AB] \\
    &= E[A^2]E[B^2] - [E(A)E(B)]^2 \\
    &= [E(A)^2 - E^2(A)][E(B)^2 - E^2(B)] \\
    &= D(A)D(B)
\end{aligned}
$$