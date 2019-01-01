---
title: 特征值和特征向量
tags:
  - 特征向量
  - 线性代数
categories:
  - 数学
date: 2019-01-01 02:38:59
---

特征值、特征向量、特征根相关知识。

<!-- more -->

## 基本定义

在线性代数中，特征（eigen-）向量（eigenvector or characteristic vector）$v$ 用矩阵 $A$ 做线性变换之后，得到的结果与 $v$ 在同一条直线上，但是长度和方向也许会改变。

如果 $T$ 是域 $F$ 上的向量空间 $V$ 到其本身的线性变换，$v$ 是 $V$ 中的非零向量，那么当 $T(v)$ 是 $v$ 的标量倍时，称 $v$ 是 $T$ 的一个特征向量。此条件可以表达成：

$$
T(v) = \lambda v
$$

如果向量空间 $V$ 是有穷维的，那么 $T$ 可以被表示为方阵 $A$，向量 $v$ 可以被表示为列向量，上述条件可以写为：

$$
Av = \lambda v
$$

- $v$: 矩阵 $A$ 的特征向量（非零）
- $\lambda$: 与特征向量 $v$ 对应，矩阵 $A$ 的特征值

在一定条件下（矩阵形式为实对称矩阵的线性变换），一个变换可以由其特征值和特征向量完全表述，也就是说：所有的特征向量组成了这向量空间的一组基底。一个特征空间（eigenspace）是具有相同特征值的特征向量与一个同维数的零向量的集合，可以证明该集合是一个线性子空间，比如 ${\displaystyle \textstyle E_{\lambda }=\{u\in V\mid Au=\lambda u\}} {\displaystyle \textstyle}$ 即为线性变换 $A$ 中以 $\lambda$ 为特征值的特征空间。

## 特征值解法

### 形式计算

$$
\begin{aligned}
    Av &= \lambda v \\
    (A - \lambda I)v &= 0
\end{aligned}
$$

等价于行列式：

$$
p_A(\lambda) = \det(A - \lambda I) = 0
$$

称 $p_A(\lambda)$ 为 $A$ 的特征多项式。求解矩阵的特征值就是求特征多项式的零点。求得特征值之后，特征向量可以通过下面的方程得到：

$$
(A - \lambda I)v = 0
$$

如果 $A$ 是一个 $n \times  n$ 矩阵，则 $p_A$ 是 $n$ 次多项式（因为只有在主对角线有 $\lambda$），因此 $A$ 最多有 $n$ 个特征值。反过来，如果 $A$ 的系数是在一个代数闭域里面（比如说复数域），那么代数基本定理说明这个方程刚好有 $n$ 个根（如果重根也计算在内的话）。所有**奇数次的多项式必有一个实数根**，因此当 $n$ 为奇数的时候，每个 $n$ 维实系数矩阵至少有一个实数特征值。当矩阵系数是实数的时候，非实数的特征值会成共轭对出现。

$n$ 为偶数时，则不一定有实数特征值。比如对于以下的矩阵 $A$（表示二维平面上的顺时针 90° 的一个旋转变换，$A(0, 1) = (1, 0)$)：

$$
\begin{bmatrix}0 & 1\\ -1 & 0\end{bmatrix}
$$

求解步骤如下：

1. $p_A(\lambda) = \det(\begin{bmatrix}
    0 - \lambda & 1\\
    -1 & 0 - \lambda
\end{bmatrix}) = \lambda^2 + 1$
2. 解得 $\lambda_1 = i, \lambda_2 = -i$
3. 由 $\begin{bmatrix}
    -\lambda & 1\\
    -1 & -\lambda
\end{bmatrix}v = 0$ 解得 $v_1 = k_1(i, -1)^T, v_2 = k_2(i, 1)^T$，$k_1, k_2$ 不为零，也就是说特征向量的的结果只在乎方向，不在乎大小。

其特征多项式是 ${\displaystyle \lambda ^{2}+1}$，因此其特征值成复共轭对出现，分别是 $i$ 和 $-i$，而没有实数特征值。相应的特征向量也是非实数的。

### 数值计算

在实践中，大型矩阵的特征值计算过程需要求解高阶多项式方程，相当费资源，而根的精确表达式对于高次多项式来说很难计算和表达。阿贝尔-鲁菲尼定理显示五次或更高次的多项式的根无法用 \${\displaystyle n}￥ n 次方根来简单表达。

对于估算多项式方程的根的有效算法是有的，但特征值中的微小误差可以导致特征向量的巨大误差。因此，寻找特征多项式和特征值的一般算法，是迭代法。最简单的方法是幂法：取一个随机向量 $v$，然后计算如下的一系列单位向量：

$$
\frac{Av}{||Av||}, {\displaystyle {\frac {A^{2}v}{||A^{2}v||}}} \frac{A^2v}{||A^2v||}, {\displaystyle {\frac {A^{3}v}{||A^{3}v||}}} \frac{A^3v}{||A^3v||}, ...
$$

分母上除以分子向量的模是为了归一化，使得最终求解的特征向量不会碎迭代次数增加而变大。可以将 $A$ 换为 ${\displaystyle (A-\mu I)^{-1}}$ 以求得特征值最接近 $\mu$ 的特征向量。

这个序列几乎总是收敛于最大绝对值的特征值所对应的特征向量。这个算法很简单，但是本身不是很有用。但是，像 QR 算法这样的算法正是以此为基础的。

计算得到特征向量之后，利用下面的方程解得特征值：

$$
{\displaystyle \lambda ={\frac {\mathbf {v} ^{*}A\mathbf {v} }{\mathbf {v} ^{*}\mathbf {v} }}}
$$

其中 $v^*$ 是 $v$ 的共轭转置。

### 现代算法

[QR algorithm, 1961](https://en.wikipedia.org/wiki/QR_algorithm) 可以准确地计算任意矩阵的特征值和特征向量。MARLAB 中就利用了 QZ 算法（The algorithm is an analog of the QR algorithm (see §7.3) for the generalized eigenvalue problem. [[Direct Methods](http://www.netlib.org/utk/people/JackDongarra/etemplates/node282.html)]）。

## 代码片段

### MATLAB

```matlab
>> A = [
    4 1;
    6 3
]

A =

     4     1
     6     3

>> e = eig(A)

e =

     6
     1

>> [V, D] = eig(A)

V =

    0.4472   -0.3162
    0.8944    0.9487
% 注意到这里每一列表示一个特征向量，而且是归一化的：0.4472^2 + 0.8944^2 = 1^2

D =

     6     0
     0     1
% 这里对角线上每个值表示一个特征值,最终有 AV =VD

>> [V, D, W] = eig(A)

V =

    0.4472   -0.3162
    0.8944    0.9487


D =

     6     0
     0     1


W =

    0.9487   -0.8944
    0.3162    0.4472
% 这里计算了左特征向量，即满足 vA = \lambda v 的特征向量。
% 注意到转置之后 W' 每一行表示一个特征向量，最终有 W'A = DW'
```

### Python

```py
import numpy

A = numpy.array([
    [4, 1],
    [6, 3]
])

w, v = numpy.linalg.eig(A)

print('e-values:\n', w)
print('e-vectors:\n', v)
```

运行结果：

```py
e-values:
 [6. 1.]
e-vectors:
 [[ 0.4472136  -0.31622777]
 [ 0.89442719  0.9486833 ]]
```

## 参考文献

1. [Eigenvalues and eigenvectors | Wikipedia](https://en.wikipedia.org/wiki/Eigenvalues_and_eigenvectors)
