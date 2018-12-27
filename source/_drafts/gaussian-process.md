---
title: 高斯过程
tags:
---

## 定义

一个连续时间随机过程 ${\displaystyle \left\{X_{t};t\in T\right\}}$ 是高斯过程，当且仅当对任意的有穷时间集合 ${\displaystyle t_{1},\ldots ,t_{k}}$，有：

$$
{\displaystyle \mathbf {X} _{t_{1},\ldots ,t_{k}}=(\mathbf {X} _{t_{1}},\ldots ,\mathbf {X} _{t_{k}})}

\tag{1}
$$

是一个多元（multivariate）高斯随机变量。这等价于任何形式的 $(\mathbf {X} _{t_{1}},\ldots ,\mathbf {X} _{t_{k}})$ 的线性组合都是单变量（univariate）高斯分布。

## 正态分布

这里补习一下正态分布的相关概念，主要是平时没有好好证明的。

### 矩生成函数 (Moment-generating function)

随机变量

## 例子

### 例 1

设 $\{X(t) = A \cos\omega t + B\sin\omega t, t \in R\}$，其中 $A, B$ 相互独立，都是服从正态分布 $N(0, \sigma^2)$ 的随机变量，$\omega$ 是常数。试证明 ${\displaystyle \left\{X(t);t\in R\right\}}$ 是正态过程，并求它的有限维分布。

#### 解答

根据定义，要证明我们要证明 ${\displaystyle \left\{X(t);t\in R\right\}}$ 是正态过程，那么可以先证明每一个时刻的 $X(t)$ 是正态分布，在此基础上证明任何连续时刻随机变量的线性组合为正态分布。

首先证明 $X(t)$ 是正态分布：

$$

$$

## 参考资料

1. [Gaussian process | Wikipedia](https://en.wikipedia.org/wiki/Gaussian_process)
2. [Example 4 - Linear transformation of a normal random variable](https://www.statlect.com/probability-distributions/normal-distribution-linear-combinations#hid6)
3. [Multivariate normal distribution](https://www.statlect.com/probability-distributions/multivariate-normal-distribution#mutual)