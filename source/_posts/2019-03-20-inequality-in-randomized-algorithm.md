---
title: 随机算法常用不等式
date: 2019-03-20 23:31:22
categories:
- 算法
- 随机算法
tags:
- randomized algorithm
---

随机算法常用不等式，持续更新中。

<!-- more -->

## Markov 不等式

### 定理

对于任意非负随机变量 $X$，有：

$$
P(X \ge t) \le \frac{E(X)}{t}
$$

对任意的 $t>0$ 成立。

> 从直观上可以理解为，某高中生平时成绩已知的情况下，高考即使发挥超常或者失误平均分都变化不会太大。我们可以根据平时的平均分判断该考生分数超过给定分数 $t$ 的概率。

### 证明

> 关键用到了积分、放缩法。

$$
\begin{aligned}
    P(X \ge t) 
    &= \int_{x=t}^{\infty}P(X=x)dx \\
    &利用 x \ge t \\
    &\le \int_{x=t}^{\infty}\frac{x}{t}P(X=x)dx \\
    &= \frac{1}{t}\int_{x=t}^{\infty}xP(X=x)dx \\
    &\le \frac{1}{t}\int_{x=0}^{\infty}xP(X=x)dx \\
    &= \frac{E(X)}{t}
\end{aligned}
$$

推广：

$$
P(X \le t) \ge 1-\frac{E(X)}{t}
$$

## Chebyshev 不等式

### 定理

对任意随机变量 $X$，有：

$$
P(|X-E(X)| \ge t) \le \frac{D(X)}{t^2}
$$

对任意 $t \ge 0$ 成立。

> 从直观上可以理解为，在已知方差的的情况下，随机变量与均值的偏差超过一定值的概率不会超过确定值。平时成绩越稳定的同学，考试时出现失误的概率就会比较小。

### 证明

令 $Y = [X-E(X)]^2$，$Y$ 是非负随机变量，

$$
|X-E(X)| \ge t \iff Y \ge t^2
$$

利用 Markov 不等式即可得出结论：

$$
E(Y \ge t^2) \le \frac{E(Y)}{t^2} = \frac{D(X)}{t^2}
$$