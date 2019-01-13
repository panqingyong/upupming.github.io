---
title: 常用的随机过程
categories:
  - 数学
tags:
  - 随机过程
  - 正态分布
---

本文介绍各种随机过程。

<!-- more -->

## 正态过程

**定义：** 设 $\{X(t), t \in T\}$ 是一随机过程，如果对 $\forall n \ge 1$ 和 $\forall t_1, t_2, \cdots, t_n \in T, (X(t_1), X(t_2), \cdots, X(t_n))$ 是 n 维正态随机变量，则称 $\{X(t), t\in T\}$ 为正态过程或高斯过程。

正态过程在随机过程的重要性，类似于正态随机变量。注意以下几点：

1. 若 $\{X(t), t \in T\}$ 是一族正态随机变量，$\{X(t), t \in T\}$ 不一定是正态过程。
2. 正态随机过程是二阶矩过程
3. 正态过程的有限维分布由它的均值函数和协方差函数完全确定

很容易想到，第一条不满足的情况是虽然它们是一族正态随机变量，但是仍然无法构成多维正态分布。构成多维正态分布的条件有哪些？多维正态分布又有哪些性质？这需要复习一下正态分布。

### 正态分布

#### 多元正态分布

多变量正态分布亦称为多变量高斯分布。它是单维正态分布向多维的推广。它同矩阵正态分布有紧密的联系。

$N$ 维随机向量 ${\displaystyle \ X=[X_{1},\dots ,X_{N}]^{T}}$ 如果服从多变量正态分布，必须满足下面的三个等价条件：

1. 任何线性组合 ${\displaystyle \ Y=a^{1}X^{1}+\cdots +a^{N}X^{N}}$ 服从正态分布。
2. 存在随机向量 ${\displaystyle \ Z=[Z_{1},\dots ,Z_{M}]^{T}}$( 它的每个元素服从独立标准正态分布），向量 ${\displaystyle \ \mu =[\mu _{1},\dots ,\mu _{N}]^{T}}$ 及 ${\displaystyle N\times M}$ 矩阵 ${\displaystyle \ A}$ 满足 ${\displaystyle \ X=AZ+\mu }$。
3. 存在 ${\displaystyle \mu }$ 和一个对称半正定阵 ${\displaystyle \ \Sigma }$ 满足 ${\displaystyle \ X}$ 的特征函数
   $$
   {\displaystyle \phi _{X}\left(u;\mu ,\Sigma \right)=\exp \left(i\mu ^{T}u-{\frac {1}{2}}u^{T}\Sigma u\right)}
   $$

如果 ${\displaystyle \ \Sigma }$ 是非奇异的，那么该分布可以由以下的 PDF 来描述：

$$
{\displaystyle f_{\mathbf {x} }(x_{1},\ldots ,x_{k})={\frac {1}{\sqrt {(2\pi )^{k}|{\boldsymbol {\Sigma }}|}}}\exp \left(-{\frac {1}{2}}({\mathbf {x} }-{\boldsymbol {\mu }})^{\mathrm {T} }{\boldsymbol {\Sigma }}^{-1}({\mathbf {x} }-{\boldsymbol {\mu }})\right),}
$$

注意这里的 ${\displaystyle |\Sigma |}$ 表示协方差矩阵的行列式。

下面解一道例题：设 $\{X(t) = A\cos\omega t + B\sin \omega t, t \in R\}$，其中 A, B 是相互独立，都服从正态分布 $N(0, \sigma^2)$ 的随机变量，$\omega$ 是常数。试证明 $\{X(t) = A\cos\omega t + B\sin \omega t, t \in R\}$ 是正态过程，并求它的有限维分布。

现在为了证明 $X(t)$ 是正态过程，我们需要证明 $X(1), X(2), \cdots, X(n)$ 是多维正态分布。需要证明上述三条规则。

举个例子，可以证明 $X(t)$ 服从正态分布，这很显然，因为[**相互独立**的正态分布的线性组合仍为正态分布](https://newonlinecourses.science.psu.edu/stat414/node/172/)，我们得到：

$$
\begin{aligned}
    X(t) \sim \mathcal{N}(0, (\cos^2\omega t + \sin^2\omega t)\sigma^2)
\end{aligned}
$$

在此基础上对第 1 条规则进行证明：

$$
\begin{aligned}
    Y
    &= \sum_{t=1}^{n}a_tX(t) \\
    &= \sum_{t=1}^{n}a_t(A\cos\omega t + B\sin \omega t) \\
    &= \left(\sum_{t=1}^{n}a_t\cos\omega t\right)A + \left(\sum_{t=1}^{n}a_t\sin\omega t\right)B \\
\end{aligned}
$$

> 这里不能简单地说因为不同 $t$ 时刻的 $X(t)$ 是正态分布，那么最终的 $Y$ 就是正态分布，因为各个 $X(t)$ 并不是相互独立的。

于是得到：

$$
Y \sim \mathcal{N}(0, \left[\left(\sum_{t=1}^{n}a_t\cos\omega t\right)^2 + \left(\sum_{t=1}^{n}a_t\sin\omega t\right)^2\right]\sigma^2)
$$

要证明第 2 条规则同样简单，由于每个 $X(t)$ 均值为 $0$，$\mu$ 肯定为 $0$，只需要构造矩阵 $A$ 即可。

$$
\begin{pmatrix}
    \cos \omega1 & \sin\omega1 & 0 & \cdots & 0 \\
    \cos \omega2 & \sin\omega2 & 0 & \cdots & 0 \\
    \vdots       & \vdots      & \vdots & \vdots & \vdots \\
    \cos \omega t & \sin\omega t & 0 & \cdots & 0 \\
    \vdots       & \vdots      & \vdots & \vdots & \vdots \\
    \cos \omega n & \sin\omega n & 0 & \cdots & 0 \\
\end{pmatrix}_{n \times m}
\begin{pmatrix}
    Z_1 \\
    Z_2 \\
    \vdots \\
    Z_m
\end{pmatrix} = \begin{pmatrix}
    X(1) = A\cos\omega 1 + B\sin \omega 1 \\
    X(2) = A\cos\omega 2 + B\sin \omega 2 \\
    \vdots \\
    X(t) = A\cos\omega t + B\sin \omega t \\
    \vdots \\
    X(n) = A\cos\omega n + B\sin \omega n \\
\end{pmatrix}
$$

第三条不会，应该也是成立的。

## 增量过程

1. 正交增量过程不是独立增量过程。
2. 独立增量过程只要有二阶矩存在，且均值函数恒为零的条件下是正交增量过程。

这两条性质相互矛盾。

根据第 2 条性质，假设 $X(t)$ 是独立增量过程，而且二阶矩存在、均值函数恒为 0，那么 $X(t)$ 是正交增量过程。

> 注意正交增量过程的二阶矩一定存在，如 $E[X(t_3)-X(t_2)][X(t_2)-X(t_1)] = 0$，其中包含了一项 $E[X^2(t_2)] < \infty$

第 2 条性质的证明：

首先证明存在性：

$$
\begin{aligned}
    E[X(t_3)-X(t_2)][X(t_2)-X(t_1)]
    &= E[X(t_3)X(t_2)]-E[X(t_3)X(t_1)] - E[X^2(t_2)] + E[X(t_2)X(t_1)]
\end{aligned}
$$

由于 $E[X^2(t_2)] < \infty$，所以存在。

接着证明值为 0：

$$
E[X(t_3)-X(t_2)][X(t_2)-X(t_1)] \xlongequal{独立增量过程} E[X(t_3)-X(t_2)]E[X(t_2)-X(t_1)] \xlongequal{均值恒为 0} 0
$$

那也就是说：**存在既是正交增量过程，又是独立增量过程的随机过程 $X(t)$**，这与第 1 条性质矛盾。

由于任意的正交增量过程一定是二阶矩过程，那么第 1 条性质应该改为：

1. 正交增量过程可能为独立增量过程，但是无法简单地由均值函数恒为 0 得到增量的独立性，就像由 $A, B$ 相互独立可以得到 $E(AB) = E(A)E(B)$，但反之却不可以。

## 泊松过程

设 $\{N(t), t \ge 0\}$ 是参数为 $\lambda$ 的泊松过程，事件 $A$ 在 $(0, \tau)$ 时间区间内出现 $n$ 次，试求 $P\{N(s) = k | N(\tau) = n, 0 < k < n, 0 < s < \tau\}$。

记：『$N(s) = k$』为事件 B，『$N(\tau) = n$』为事件 A。

$$
P(A) = \frac{(\lambda \tau)^ne^{-\lambda\tau}}{n!}
$$

$$
P(B) = \frac{(\lambda s)^ke^{-\lambda s}}{k!}
$$

$$
\begin{aligned}
    P\{N(s) = k | N(\tau) = n, 0 < k < n, 0 < s < \tau\} =& \frac{P(AB)}{P(A)} \\
    \xlongequal{利用独立增量过程的性质}& \frac{P\{N(s) = k, N(\tau) - N(s) = n-k\}}{P(A)} \\
    =& \frac{P(B)P(C)}{P(A)}
\end{aligned}
$$

其中事件 C 为：『$N(\tau) - N(s) = n-k$』，由泊松过程的性质，左边的随机变量服从 $\pi(\lambda(\tau -s))$：

$$
P(C) = \frac{[\lambda (\tau - s)]^{(n-k)}e^{-\lambda (\tau - s)}}{(n-k)!}
$$

所以：

$$
\begin{aligned}
    P\{N(s) = k | N(\tau) = n\}
    &= \frac{(\lambda s)^ke^{-\lambda s}}{k!} \cdot \frac{[\lambda (\tau - s)]^{(n-k)}e^{-\lambda (\tau - s)}}{(n-k)!} \cdot \frac{n!}{(\lambda \tau)^ne^{-\lambda\tau}} \\
    &= C_n^k \frac{
        (\lambda s)^ke^{-\lambda s} \cdot
        {[\lambda (\tau - s)]^{(n-k)}e^{-\lambda (\tau - s)}}
        }{(\lambda \tau)^ne^{-\lambda\tau}} \\
    &= C_n^k \frac{(\lambda s)^k \cdot [\lambda (\tau - s)]^{(n-k)}}{(\lambda \tau)^n} \\
    &= C_n^k \frac{s^k \cdot [(\tau - s)]^{(n-k)}}{\tau^n} \\
    &= C_n^k \left(\frac{s}{\tau}\right)^k \left(1-\frac{s}{\tau}\right)^{n-k} \\
\end{aligned}
$$

泊松分布的可加性：若 $X_1, X_2$ 是参数分别为 $\lambda_1, \lambda_2$ 的**相互独立**的泊松分布，那么 $X_1 + X_2$ 是参数为 $\lambda_1 + \lambda_2$ 的泊松分布。

$$
P\left(X_1 = k_1\right) = \frac{\lambda_1^{k_1}e^{-\lambda_1}}{k_1!}
$$

$$
P\left(X_2 = k_2\right) = \frac{\lambda_2^{k_2}e^{-\lambda_2}}{k_2!}
$$

则有：

$$
\begin{aligned}
    P\left(X_1+X_2 = k_1+k_2\right)
    &\xlongequal{全概率公式，相互独立} \sum_{k = 0}^{k_1+k_2} P(X_1 = k)P(X_2 = k_1+k_2-k) \\
    &= \sum_{k = 0}^{k_1+k_2} \frac{\lambda_1^{k}e^{-\lambda_1}}{k!} \frac{\lambda_2^{k_1 + k_2 - k}e^{-\lambda_2}}{(k_1 + k_2 - k)!}
\end{aligned}
$$

就是要证明：

$$
\begin{aligned}
    \sum_{k = 0}^{k_1+k_2} \frac{\lambda_1^{k}e^{-\lambda_1}}{k!} \frac{\lambda_2^{k_1 + k_2 - k}e^{-\lambda_2}}{(k_1 + k_2 - k)!} &= \frac{(\lambda_1 + \lambda_2)^{k_1 + k_2}e^{-(\lambda_1 + \lambda_2)}}{(k_1 + k_2)!}\\
    \sum_{k = 0}^{k_1+k_2} \frac{\lambda_1^{k}}{k!} \frac{\lambda_2^{k_1 + k_2 - k}}{(k_1 + k_2 - k)!} &= \frac{(\lambda_1 + \lambda_2)^{k_1 + k_2}}{(k_1 + k_2)!}\\
    \sum_{k = 0}^{k_1+k_2} C_{k_1+k_2}^k\frac{\lambda_1^{k}\lambda_2^{k_1 + k_2 - k}}{(k_1+k_2)!} &= \frac{(\lambda_1 + \lambda_2)^{k_1 + k_2}}{(k_1 + k_2)!}\\
\end{aligned}
$$

根据二项展开的公式，上式显然是成立的了。

在此基础上，我们可以得到泊松过程的和仍为泊松过程：$X(t) = N_1(t) + N_2(t)$ 是强度为 $\lambda_1 + \lambda_2$ 的泊松分布。

### 特征函数

根据特征函数的公式：

$$
\Phi(\omega) = E[\exp\{j\omega X\}]
$$

连续型：

$$
\Phi(\omega) = \int_{-\infty}^{+\infty}f(x)\exp\{j\omega x\}dx
$$

离散型：

$$
\Phi(\omega) = \sum_{k=0}^{\infty}P(X=k)\exp\{j\omega k\}
$$

可以算出泊松分布的特征函数为：

$$
\Phi(\omega) = \exp\left\{-\lambda(1-e^{j\omega})\right\}
$$

据此证明 $X(t) = N_1(t) - N_2(t)$ 不是泊松过程：

$$
\begin{aligned}
    \Phi_{X(t)}(\omega)
    &= \Phi_{N_1(t) - N_2(t)}(\omega) \\
    &= ...(积分过程, 类似于求解泊松分布的特征函数) \\
    &= \exp\left\{-(\lambda_1+\lambda_2)t + \lambda_1 te^{j\omega} + \lambda_2 te^{-j\omega}\right\}
\end{aligned}
$$

得到 $X(t)$ 的特征函数不符合泊松分布特征函数的形式，不是泊松过程。

$$
\begin{aligned}
    P[X(5) = 6 | X(3) = 4]
    &= \frac{P[X(5) = 6, X(3) = 4]}{X(3) = 4} \\
    &= P[X(5)-X(3) = 2] \\
    &= \frac{(2\lambda)^2e^{-2\lambda}}{2} = 2\lambda^2e^{-2\lambda}
\end{aligned}
$$
