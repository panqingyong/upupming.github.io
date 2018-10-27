---
title: 逻辑回归
date: 2018-10-27 20:47:22
tags:
- 机器学习
- Machine Learning
- Python
categories:
- 机器学习
- 分类算法
---

本文是根据逻辑回归实验总结的数学推导和实验结果。

<!-- more -->

## 数学符号格式规范

本文格式参考了 [Bishop 2006]，若不加特殊说明，定义向量时均是列向量。

|数据类型|格式规范|$LaTex$ 写法|实际效果|
|-|-|-|-|
|向量、矩阵|加粗罗马字母|`\mathrm{\mathbf{w}}`|$\mathrm{\mathbf{w}}$|
|转置|右上标 T|`(w_0, w_1, ..., w_M)^T`|$(w_0, w_1, ..., w_M)^T$|
|随机变量分布类型|书法字母 (calligraphic letters)|`\mathcal{N}`|$\mathcal{N}$|

## 设计思想

### 逻辑模型 <sup>**[[Logistic regression](https://en.wikipedia.org/wiki/Logistic_regression)]**</sup>

考虑只有两个预测器 $x_1, x_2$ 的模型，它们可能是连续变量，也可能是布尔值。发生比对数（Logit(log-odds)）通常形式为：

$$
l = \beta_0 + \beta_1 x_1 + \beta_2 x_2

\tag{1}
$$

系数 $\beta_i$ 是模型的参数，注意这里是线性模型，因为 Logit 是预测器 $x_1, x_2$ 的线性组合，再加上常数 $\beta_0$。相应的发生比（odds）就是指数形式：

$$
o = b^{\beta_0 + \beta_1x_1 + \beta_2x_2}

\tag{2}
$$

发生比一般定义为某个事件发生和不发生的比率 $\frac{p}{1-p}$，$b$ 是对数和指数函数所用的底数。因为发生比不是预测器的线性组合，这就是一个非线性的模型。

假设事件有 $1$ 次不发生，那么就有 $o$ 次发生，总共有 $1 + o$ 次试验，因此事件发生的概率 $p$为：

$$
\begin{aligned}
  p 
  &= \frac{o}{1 + o} \\
  &= \frac{b^{\beta_0 + \beta_1x_1 + \beta_2x_2}}{b^{\beta_0 + \beta_1x_1 + \beta_2x_2} + 1} \\
  &= \frac{1}{1 + b^{-(\beta_0 + \beta_1x_1 + \beta_2x_2)}}

\end{aligned}

\tag{3}
$$

通常将底数 $b$ 取值为 $e$，但在计算指数的时候还是取 $10$，这样计算出来的发生比更易于理解。对于参数为 $\mathrm{\mathbf{\beta}}^T = (-3, 1, 2)$ 的模型，$l$ 为：

$$
l = -3 + 1 \cdot x_1 + 2 \cdot x_2

\tag{4}
$$

这个模型的含义如下：

+ $\beta_0 = -3$ 是 $y-$截距，表示所有预测器都是 0 时的发生比对数。发生比为 $10^-3 = 1:1000$，那么发生概率为 $1/(1000 + 1) = 1/1001 \approx 0.001 = 0.1\%$。

+ $-\beta_0 = 3$ 是 $x-$截距，表示发生比对数 $l = 0$ 时 $l' = 1 \cdot x_1 + 2 \cdot x_2$ 的值。在这个时候发生比为 $10^0 = 1$，发生概率为 $1/(1+1) = 1/2 = 50\%$。

+ $\beta_1 = 1$ 意味着 $x_1$ 每增大 $1$，发生比对数增加 $1 \cdot 1$，发生比变为原来的 $10^1 = 10$ 倍。

+ $\beta_2 = 2$ 意味着 $x_2$ 每增大 $1$，发生比对数增加 $2 \cdot 1$，发生比变为原来的 $10^2 = 100$ 倍。

这个模型很有用处，比如为了比较两种医疗方式的效果，一种将 $x_1$ 减小了 $3$，另一种将 $x_2$ 减小了 $2$，在这个模型之下，第一种医疗方式将发生比除以了 $10^{(1 \cdot 3)} = 1000$，第二种将发生比除以了 $10^{(2 \cdot 2)} = 10000$，因此第二种医疗方式更有效。

逻辑回归的任务就是估计这种逻辑模型的参数，同时计算对数据拟合的好坏程度。


### 发生比及其对数的得来

上一节直接给出了发生比对数就是自变量的线性组合，并指出了在给定参数下自变量的某个分量的变化对事件发生比的影响。但是我们需要思考：为什么发生比对数 $l$ 定义为自变量的线性组合呢？

逻辑回归往往研究的都是二值自变量 $Y$ 的取值问题，即成功（事件发生，类别 $1$，$Y = 1$）、不成功（事件不发生，类别 $0$，$Y = 0$）两类。

对于给定的 $n + 1$ 维向量 $\mathrm{\mathbf{X}} = (1, X_1, X_2, ..., X_n)^T$，我们需要预测随机变量 $Y$（可以看作是类别）为 $0$ 或 $1$ 的概率。

根据贝叶斯公式：

$$
\begin{aligned}
  P(Y = 1 | \mathrm{\mathbf{X}})
  &= \frac{P(Y = 1)P(\mathrm{\mathbf{X}}|Y=1)}{P(Y=0)P(\mathrm{\mathbf{X}}|Y=0)) + P(Y=1)P(\mathrm{\mathbf{X}}|Y=1)} \\
  &= \frac{1}{1 + \frac{P(Y=0)P(\mathrm{\mathbf{X}}|Y=0)}{P(Y=1)P(\mathrm{\mathbf{X}}|Y=1)}} \\
  &\xlongequal{取对数, \mathrm{\mathbf{X}} 各分量之间相互独立} \frac{1}{1 + \exp \ln \frac{P(Y=0) \prod_{i=1}^{n}P(X_i|Y=0)}{P(Y=1)\prod_{i=1}^{n}P(X_i|Y=1)}} \\
  &\xlongequal{P(Y=1) = \pi} \frac{1}{1 + \exp [\ln\frac{\pi}{1 - \pi} + \sum_{i=1}^{n}\ln \frac{P(X_i|Y=0)}{P(X_i|Y=1)}}
  
\tag{5}
\end{aligned}
$$

我们假定每一类中的 $\mathrm{\mathbf{X}}$ 都服从相应的正态分布，比如在 $Y=0$ 这一类中随机变量 $X_i$ 就服从正态分布 $\mathcal{N}(\mu_{i0}, \sigma_{i0})$：

$$
P(X_i|Y = k) = \frac{1}{\sigma_{ik}\sqrt{2\pi}}\exp{\frac{-(X_i-\mu_{ik})^2}{2\sigma_{ik}^2}}

\tag{6}
$$

取对数得到：

$$
\ln P(X_i|Y = k) = -\ln \sigma_{ik}\sqrt{2\pi} - \frac{(X_i-\mu_{ik})^2}{2\sigma_{ik}^2}

\tag{7}
$$

在不同类别的 $\mathrm{\mathbf{X}}$ 方差都相同的情况下，$k$ 值不同的 $\sigma_{ik}$ 均用 $\sigma_i$ 表示，$(5)$ 式分母中被求和的通项是：

$$
\begin{aligned}
    \ln \frac{P(X_i|Y=0)}{P(X_i|Y=1)}
    &= \ln P(X_i|Y=0) - \ln P(X_i|Y=1) \\
    &= (-\ln \sigma_{i0}\sqrt{2\pi} - \frac{(X_i-\mu_{i0})^2}{2\sigma_{i0}^2}) - (-\ln \sigma_{i1}\sqrt{2\pi} - \frac{(X_i-\mu_{i1})^2}{2\sigma_{i1}^2}) \\
    &= \frac{\mu_{i0} - \mu_{i1}}{\sigma_i^2}X_i - \frac{\mu_{i0}^2 - \mu_{i1}^2}{2\sigma_i^2}

\tag{8}
\end{aligned}
$$

因此 $(5)$ 式的结果为：

$$
\begin{aligned}
    P(Y = 1 | \mathrm{\mathbf{X}})
    &= \frac{1}{1 + \exp \sum_{i=1}^{n}[\frac{\mu_{i1} - \mu_{i0}}{\sigma_i^2}X_i - \frac{\mu_{i1}^2 - \mu_{i0}^2}{2\sigma_i^2}]} \\
    &= \frac{1}{1 + \exp (-\theta_0 + \sum_{i=1}^{n}-\theta_iX_i)}

\tag{9}
\end{aligned}
$$

（可以看到，当不同类别的 $\mathrm{\mathbf{X}}$ 方差都相同的情况下，我们将得到线性边界。）

那么我们可以得到另一类的概率：

$$
\begin{aligned}
    P(Y = 0 | \mathrm{\mathbf{X}})
    &= 1 - P(Y = 1 | \mathrm{\mathbf{X}}) \\
    &= \frac{\exp (-\theta_0 + \sum_{i=1}^{n}-\theta_iX_i)}{1 + \exp (-\theta_0 + \sum_{i=1}^{n}-\theta_iX_i)}

\tag{10}
\end{aligned}
$$

以 $p = P(Y = 1 | \mathrm{\mathbf{X}})$ 作为发生（成功，类别 1）的概率，那么发生比为：

$$
\begin{aligned}
  o 
    &= \exp{(\theta_0 + \sum_{i=1}^{n}\theta_iX_i)}
\end{aligned}

\tag{11}
$$

这就是前文的 $(1) (2)$ 两个式子的得来，我们也不难得出前文的 $b = e, \beta_i = \theta_i$。


### 利用机器学习算法获得模型参数

我们以概率划分事件的发生与否，也就是说 $p > 0.5$（$o > 1$） 记为成功的一类，即 $Y = 1$，$p < 0.5$（$o < 1$） 记为不成功的另一类，即 $Y = 0$。以 $\mathrm{\mathbf{\theta}}$ 为参数，得到如下的边界函数：

$$
\begin{aligned}
  l &= \theta_0 + \theta_1X_1 + ... + \theta_nX_n \\
  &= \mathrm{\mathbf{\theta}}^T\mathrm{\mathbf{X}}
\end{aligned}

\tag{12}
$$

定义标准 Logistic 函数（是一种 sigmoid 函数（值域在 $0$ 到 $1$ 之间）），在自变量大于 $0$ 时函数值大于 $0.5$，在自变量小于 $0$ 时函数值小于 $0.5$：

$$
g(z) = \frac{1}{1 + e^{-z}}

\tag{13}
$$

当自变量 $z$ 在 $[-6, 6]$ 之间时，它的图像如下：

![Standard logistic sigmoid function](https://upload.wikimedia.org/wikipedia/commons/8/88/Logistic-curve.svg)


那么相应的预测函数是将 Logistic 函数的自变量看做边界函数 $l$ 的结果：

$$
\begin{aligned}
  h_\theta(\mathrm{\mathbf{X}}) &= g(l) \\
  &= \frac{1}{1 + \exp{(-l)}} \\
  &= \frac{1}{1 + \exp{-\mathrm{\mathbf{\theta}}^T\mathrm{\mathbf{X}}}}

\tag{14}
\end{aligned}
$$

$h_\theta(\mathrm{\mathbf{X}})$ 就是成功的概率：

$$
\begin{aligned}
    & P(Y = 1|\mathrm{\mathbf{X}};\mathrm{\mathbf{\theta}}) = h_\theta(\mathrm{\mathbf{X}}) \\
    & P(Y = 0|\mathrm{\mathbf{X}};\mathrm{\mathbf{\theta}}) = 1 - h_\theta(\mathrm{\mathbf{X}})

\tag{15}
\end{aligned}
$$

式 $(15)$ 可以利用指数函数统一成一个式子：

$$
P(Y = y|\mathrm{\mathbf{X}};\mathrm{\mathbf{\theta}}) = h_\theta(\mathrm{\mathbf{X}})^y[1 - h_\theta(\mathrm{\mathbf{X}})]^{1-y}

\tag{16}
$$

在 $\mathrm{\mathbf{X}}$ 各个分量都是独立同分布的情况下，一共观测 $m$ 组数据 $\mathrm{\mathbf{x}} = (\mathbf{x^1}, \mathbf{x^2}, ..., \mathbf{x^m})$，它们的类别分别是 $\mathrm{\mathbf{y}} = (y^1, y^2, ..., y^3)$，我们得到以参数 $\mathbf{\theta}$ 为自变量，出现 $\mathrm{\mathbf{y}}$ 的概率 $L$ 为因变量的条件似然函数：

$$
\begin{aligned}
  L({\mathbf{\theta}}|\mathrm{\mathbf{x}})

  &= \prod_{l=1}^m P(y^l|\mathrm{\mathbf{x^l}};\mathbf{\theta}) \\
  &= \prod_{l=1}^m P(y^l|\mathrm{\mathbf{x^l}};\mathbf{\theta}) \\
  &= \prod_{l=1}^m h_\theta(\mathrm{\mathbf{x^l}})^{y^l}[1 - h_\theta(\mathrm{\mathbf{x^l}})]^{1-y^l}

\tag{17}
\end{aligned}
$$

对数似然函数为：

$$
\begin{aligned}
  l({\mathbf{\theta}}|\mathrm{\mathbf{x}})
&= \ln L({\mathbf{\theta}}|\mathrm{\mathbf{x}}) \\
&= \sum_{l=1}^m \{y^l\ln h_\theta(\mathrm{\mathbf{x^l}}) + (1-y^l)\ln [1 - h_\theta(\mathrm{\mathbf{x^l}})]\} \\
&= \sum_{l=1}^m \{y^l\ln h_\theta(\mathrm{\mathbf{x^l}}) - y^l\ln [1-h_\theta(\mathrm{\mathbf{x^l}})] + y^l\ln [1-h_\theta(\mathrm{\mathbf{x^l}})] + (1-y^l)\ln [1 - h_\theta(\mathrm{\mathbf{x^l}})]\} \\
&= \sum_{l=1}^m \{y^l{\mathbf{\theta}}^T\mathrm{\mathbf{x^l}} + \ln [1-h_\theta(\mathrm{\mathbf{x^l}})]\} \\
&= \sum_{l=1}^m \{y^l{\mathbf{\theta}}^T\mathrm{\mathbf{x^l}} -{\mathbf{\theta}}^T\mathrm{\mathbf{x^l}} - \ln (1 + \exp{-{\mathbf{\theta}}^T\mathrm{\mathbf{x^l}}})\}

\tag{18}
\end{aligned}
$$

最大似然估计就是要求得使 $l({\mathbf{\theta}}|\mathrm{\mathbf{x}})$ 取最大值时的 $\mathbf{\theta}$，我们可以使用梯度上升法求解。对其求导数得：

$$
\begin{aligned}
  \frac{\partial l({\mathbf{\theta}}|\mathrm{\mathbf{x}})}{\partial \mathbf{\theta}} 
  &= \sum_{l=1}^m \{(y^l-1)\mathrm{\mathbf{x^l}}^T + \frac{\mathrm{\mathbf{x^l}}^T\exp{-{\mathbf{\theta}}^T\mathrm{\mathbf{x^l}}}}{1 + \exp{-{\mathbf{\theta}}^T\mathrm{\mathbf{x^l}}}}\} \\
  &= \sum_{l=1}^m \mathrm{\mathbf{x^l}}^T\{y^l - 1 + \frac{\exp{-{\mathbf{\theta}}^T\mathrm{\mathbf{x^l}}}}{1 + \exp{-{\mathbf{\theta}}^T\mathrm{\mathbf{x^l}}}}\} \\
  &= \sum_{l=1}^m \mathrm{\mathbf{x^l}}^T\{y^l - 1 + P(y^l = 0|\mathrm{\mathbf{x^l}};\mathrm{\mathbf{\theta}})\} \\
  &= \sum_{l=1}^m \mathrm{\mathbf{x^l}}^T\{y^l - P(y^l = 1|\mathrm{\mathbf{x^l}};\mathrm{\mathbf{\theta}})\} \\
  &= \sum_{l=1}^m \mathrm{\mathbf{x^l}}^T\{y^l - \frac{1}{1 + \exp{-{\mathbf{\theta}}^T\mathrm{\mathbf{x^l}}}}\} \\
\end{aligned}

\tag{19}
$$

假设学习步长为 $\eta$，第 $k$ 轮迭代的参数为 ${\mathbf{\theta}}^{(t)}$，则梯度上升迭代过程为：

$$
\theta^{(t+1)} = \theta^{(t)} + \eta \sum_{l=1}^m \mathrm{\mathbf{x^l}}\{y^l - \frac{1}{1 + \exp{-{\mathbf{\theta}^{(t)}}^T\mathrm{\mathbf{x^l}}}}\}

\tag{20}
$$

### 实验数据生成

根据『利用机器学习算法获得模型参数』一节的推导，要想得到线性边界，数据必须满足是方差相同的高斯分布的条件。我们只生成二维的数据 $\mathrm{\mathbf{X}} = (X_1, X_2)$ 便于图形化显示，生成的数据服从的正态分布,

$$
第 0 类(Y = 0)：X_1\sim {\mathcal {N}}(\mathrm{\mu}_{10}, \mathrm{\sigma_1}^2) 和 X_2\sim {\mathcal {N}}(\mathrm{\mu}_{20} , \mathrm{\sigma_2}^2) \\

第 1 类(Y = 1)：X_1\sim {\mathcal {N}}(\mathrm{\mu}_{11}, \mathrm{\sigma_1}^2) 和 X_2\sim {\mathcal {N}}(\mathrm{\mu}_{21} , \mathrm{\sigma_2}^2)

\tag{21}
$$

或者写成二维正态分布的形式：

$$
第 0 类(Y = 0)：\mathrm{\mathbf{X}} \sim \mathcal{N(\mathrm{\mu}_0, \mathrm{\Sigma})} \\

第 1 类(Y = 1)：\mathrm{\mathbf{X}} \sim \mathcal{N(\mathrm{\mu}_1, \mathrm{\Sigma})} 

\tag{22}
$$

### 最大后验估计（MAP），带惩罚项的梯度上升法

根据贝叶斯公式：

$$
p(\mathrm{\mathbf{\omega}}|\mathrm{\mathbf{D}}) = \frac{p(\mathrm{\mathbf{D}}|\mathrm{\mathbf{\omega}})p(\mathrm{\mathbf{\omega}})}{p(\mathrm{\mathbf{D}})}

\tag{23}
$$

其中：
 
+ $p(\mathrm{\mathbf{\omega}}|\mathrm{\mathbf{D}})$ 为后验概率，可以理解为『在已经知道数据的情况下模型参数为 $\mathrm{\mathbf{\omega}}$ 的概率』
+ $p(\mathrm{\mathbf{D}}|\mathrm{\mathbf{\omega}})$ 为似然函数，可以理解为『在给定参数情况下，得到的结果与已知数据吻合的概率』
+ $p(\mathrm{\mathbf{\omega}})$ 为先验概率，可以理解为『模型参数是 $\mathrm{\mathbf{\omega}}$ 的概率』

就拿抛硬币问题（抛了 5 次）来举例：

+ $p(\mathrm{\mathbf{\omega}}|\mathrm{\mathbf{D}})$ 为后验概率，可以理解为『在已经知道数据的情况下（4 次正面，1 次反面）模型参数为 $\mathrm{\mathbf{\omega}}$ 的概率』
+ $p(\mathrm{\mathbf{D}}|\mathrm{\mathbf{\omega}})$ 为似然函数，可以理解为『在给定参数情况下，得到的结果与已知数据吻合（4 次正面，1 次反面）的概率』
+ $p(\mathrm{\mathbf{\omega}})$ 为先验概率，可以理解为『模型参数是 $\mathrm{\mathbf{\omega}}$ 的概率』

在抛硬币问题中，我们仅仅最大化似然函数是不准确的，因为求得了一个模型参数 $\mathrm{\mathbf{\omega}}$ 使 4 次正面，1 次反面这种情况最大化了，但要知道这个模型参数出现的概率也是很小的（概率最大的模型参数是正反面 1:1 出现）。因此我们要最大化的其实是『在已经知道数据的情况下（4 次正面，1 次反面）模型参数为 $\mathrm{\mathbf{\omega}}$ 的概率』，这就是后验概率，从 $(23)$ 式中可以看出它正比于似然函数与先验概率的乘积。

在 $(17)$ 式的基础上，我们可以得到后验概率：

$$
P(\mathrm{\mathbf{\theta}}; \mathrm{\mathbf{y}}|\mathrm{\mathbf{x}}) \propto P(\mathrm{\mathbf{y}}|\mathrm{\mathbf{x}; \mathrm{\mathbf{\theta}}})P(\mathrm{\mathbf{\theta}})

\tag{24}
$$

进一步设先验服从高斯分布：

$$
P(\mathrm{\mathbf{\theta}}) = s\exp{-\frac{\alpha}{2}\mathrm{\mathbf{\theta}}^T\mathrm{\mathbf{\theta}}}

\tag{25}
$$

结合式 $(17) (24)$并求对数，省略常数项得到：

$$
\begin{aligned}
  \widetilde{M(\mathrm{\mathbf{\theta}})} &= \ln P(\mathrm{\mathbf{\theta}}) + \sum_{l=1}^m \{y^l{\mathbf{\theta}}^T\mathrm{\mathbf{x^l}} -{\mathbf{\theta}}^T\mathrm{\mathbf{x^l}} - \ln (1 + \exp{-{\mathbf{\theta}}^T\mathrm{\mathbf{x^l}}})\} \\
  &= -\frac{\alpha}{2}\mathrm{\mathbf{\theta}}^T\mathrm{\mathbf{\theta}} + \sum_{l=1}^m \{y^l{\mathbf{\theta}}^T\mathrm{\mathbf{x^l}} -{\mathbf{\theta}}^T\mathrm{\mathbf{x^l}} - \ln (1 + \exp{-{\mathbf{\theta}}^T\mathrm{\mathbf{x^l}}})\} \\
  &= -\frac{\lambda}{2}\mathrm{\mathbf{\theta}}^T\mathrm{\mathbf{\theta}} + \sum_{l=1}^m \{y^l{\mathbf{\theta}}^T\mathrm{\mathbf{x^l}} -{\mathbf{\theta}}^T\mathrm{\mathbf{x^l}} - \ln (1 + \exp{-{\mathbf{\theta}}^T\mathrm{\mathbf{x^l}}})\}
\end{aligned}

\tag{26}
$$

式中取 $\lambda = \alpha$。

参考式 $(19)$，求导得到：

$$
\begin{aligned}
  \frac{\partial \widetilde{M(\mathrm{\mathbf{\theta}})}}{\partial \mathrm{\mathbf{\theta}}} 
  &= -\lambda\mathrm{\mathbf{\theta}}^T + \sum_{l=1}^m \mathrm{\mathbf{x^l}}^T\{y^l - P(y^l = 1|\mathrm{\mathbf{x^l}};\mathrm{\mathbf{\theta}})\}\\
\end{aligned}

\tag{27}
$$

从而,带惩罚项的迭代过程为：

$$
\mathrm{\mathbf{\theta}}^{(t+1)} = \mathrm{\mathbf{\theta}}^{(t)} + \eta\{-\lambda\mathrm{\mathbf{\theta}}^{(t)} + \sum_{l=1}^m \mathrm{\mathbf{x^l}}\{y^l - \frac{1}{1 + \exp{-{\mathbf{\theta}^{(t)}}^T\mathrm{\mathbf{x^l}}}}\}\}

\tag{28}
$$

#### 牛顿法

根据多元函数求极值问题的规则，极值点处的导数一定均为 $0$，我们要求的是对数似然函数的极值，可以转换为求其导数的零点。在已知对数似然函数表达式（式 $(19)$）的情况下，我们可以列出 $n+1$ 个方程，联立解出所有参数：

$$
\begin{aligned}
\frac{\partial l(\mathrm{\mathbf{\theta}})}{\partial \theta_0} 
&= \sum_{l=1}^m {x_0^l}\{y^l - \frac{1}{1 + \exp{-{\mathbf{\theta}}^T\mathrm{\mathbf{x^l}}}}\} \\

\frac{\partial l(\mathrm{\mathbf{\theta}})}{\partial \theta_1} 
&= \sum_{l=1}^m {x_1^l}\{y^l - \frac{1}{1 + \exp{-{\mathbf{\theta}}^T\mathrm{\mathbf{x^l}}}}\} \\

& \quad \quad ... \\

\frac{\partial l(\mathrm{\mathbf{\theta}})}{\partial \theta_n} 
&= \sum_{l=1}^m {x_n^l}\{y^l - \frac{1}{1 + \exp{-{\mathbf{\theta}}^T\mathrm{\mathbf{x^l}}}}\} \\

\end{aligned}

\tag{29}
$$
在具体解方程之前需要用 Hessian 矩阵来判断极值的存在性。求 Hessian 矩阵就得先求二阶偏导：

![equation 30](./images/equation-30.png)


由前文的定义：

$$
\begin{aligned}
\mathrm{\mathbf{x}} 
&= (\mathrm{\mathbf{x^1}, \mathrm{\mathbf{x^2}}..., \mathrm{\mathbf{x^m}}}) \\
&= \begin{pmatrix}
  x^1_0 & x^2_0 & x^3_0 & \cdots & x^m_0 \\
  x^1_1 & x^2_1 & x^3_1 & \cdots & x^m_1 \\
  \vdots   & \vdots   & \vdots   & \ddots & \vdots \\
  x^1_n & x^2_n & x^3_n & \cdots & x^m_n \\
\end{pmatrix}_{(n+1) \times m}
\end{aligned}

\tag{31}
$$

其 Hessian 矩阵为：

$$
\mathrm{\mathbf{H}}_{(n+1)\times(n+1)} = \mathrm{\mathbf{xAx}}^T

\tag{32}
$$

满足 $\mathrm{\mathbf{H}}_{kj} = \frac{\partial^2 l(\mathrm{\mathbf{\theta}})}{\partial \theta_k \partial\theta_j}$，其中：

$$
\mathrm{\mathbf{A}} = \begin{pmatrix}
  h_\theta(\mathrm{\mathbf{\mathrm{\mathbf{x^1}}}})[h_\theta(\mathrm{\mathbf{\mathrm{\mathbf{x^1}}}}) - 1] & 0 & \cdots & 0 \\
  0 & h_\theta(\mathrm{\mathbf{\mathrm{\mathbf{x^2}}}})[h_\theta(\mathrm{\mathbf{\mathrm{\mathbf{x^2}}}}) - 1] & \cdots & 0 \\
  \vdots & \vdots & \ddots & \vdots \\
  0 & 0 & \cdots & h_\theta(\mathrm{\mathbf{\mathrm{\mathbf{x^m}}}})[h_\theta(\mathrm{\mathbf{\mathrm{\mathbf{x^m}}}}) - 1]
\end{pmatrix}_{m \times m}

\tag{33}
$$

如果 $\mathrm{\mathbf{A}}$ 负定，则对任意的 $n+1$ 维向量 $\mathrm{\mathbf{z}}$ 有：

$$
\begin{aligned}
  \mathrm{\mathbf{z}}^T\mathrm{\mathbf{x}}A\mathrm{\mathbf{x}}^T\mathrm{\mathbf{z}}
  &= (\mathrm{\mathbf{x}}^T\mathrm{\mathbf{z}})^TA(\mathrm{\mathbf{x}}^T\mathrm{\mathbf{z}}) < 0
\end{aligned}

\tag{34}
$$

也就是说 Hessian 矩阵 $\mathrm{\mathbf{x}}A\mathrm{\mathbf{x}}^T$ 也是负定的。

我们可以先从二维的函数来理解牛顿迭代法,其思想是取图像上的 $x$ 坐标为当前估计零点值的点为切点做一条切线，求切线与 $x$ 轴的交点，将其作为新的估计零点，示意图如下：

![newton's method](https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/NewtonIteration_Ani.gif/300px-NewtonIteration_Ani.gif)

<center>图片来自于 Wikipedia</center>

为了求方程 $f'(x)$ 的根，把原函数 $f(x)$ 泰勒展开到二阶形式：

$$
f(x+\Delta x) = f(x) + f'(x)\Delta x + \frac{1}{2}f''(x)\Delta x^2

\tag{35}
$$

当且仅当 $\Delta x$ 无限趋于 $0$ 时等式成立（即后面的项被省去）。此时上式等价于：

$$
f'(x) + \frac{1}{2}f''(x)\Delta x = 0

\tag{36}
$$

因为 $\Delta x\rightarrow 0$，$\frac{1}{2}$ 将不再起作用，于是有：

$$
f'(x) + f''(x)\Delta x = 0

\tag{37}
$$

求解得到：

$$
\Delta x = \frac{f'(x)}{f''(x)}

\tag{38}
$$

得出迭代公式：

$$
x_{t+1} = x_t - \frac{f'(x)}{f''(x)}, \quad \text{t = 0, 1, ...}

\tag{39}
$$

在我们这里，不难得出迭代公式为：

$$
\mathrm{\mathbf{\theta}}^{(t+1)} = \mathrm{\mathbf{\theta}}^{(t)} - \frac{\mathrm{\mathbf{U}}}{\mathrm{\mathbf{H}}} = \mathrm{\mathbf{\theta}}^{(t)} - {\mathrm{\mathbf{H}}}^{-1}\mathrm{\mathbf{U}}

\tag{40}
$$

其中 $\mathrm{\mathbf{U}}$ 为一阶导数：

$$
\begin{aligned}
  \mathrm{\mathbf{U}}_{(n+1)\times1} 
  &= \mathbf{\mathrm{x}}_{(n+1)\times m}\begin{pmatrix}
  y^1 - h_\theta(\mathrm{\mathbf{\mathrm{\mathbf{x^1}}}}) \\
  y^2 - h_\theta(\mathrm{\mathbf{\mathrm{\mathbf{x^2}}}}) \\
  \vdots \\
  y^m - h_\theta(\mathrm{\mathbf{\mathrm{\mathbf{x^m}}}}) \\
\end{pmatrix}_{m \times 1} \\
  &= \mathrm{\mathbf{x^1}}[y^1 - h_\theta(\mathrm{\mathbf{\mathrm{\mathbf{x^1}}}})] + \mathrm{\mathbf{x^2}}[y^2 - h_\theta(\mathrm{\mathbf{\mathrm{\mathbf{x^2}}}})] + \cdots + \mathrm{\mathbf{x^m}}[y^m - h_\theta(\mathrm{\mathbf{\mathrm{\mathbf{x^m}}}})]
\end{aligned}

\tag{42}
$$

## 实验结果与分析

### 梯度上升法

后续生成的数据均满足下面的高斯分布：

$$
第 0 类(Y = 0)：\mathrm{\mathbf{X}} \sim \mathcal{N(\begin{pmatrix}
  0.8 \\ 1.0
\end{pmatrix}
  , \mathrm{\begin{pmatrix}
    0.2 & 0 \\
    0 & 0.3
  \end{pmatrix}})} \\

第 1 类(Y = 1)：\mathrm{\mathbf{X}} \sim \mathcal{N(\begin{pmatrix}
  1.4 \\ 1.6
\end{pmatrix}, \mathrm{\begin{pmatrix}
    0.2 & 0 \\
    0 & 0.3
  \end{pmatrix}})}
$$

#### 数据量 20:20

训练结果：

![20:20](./images/gradient-ascent-20-0.0.png)

<object data="./training_results/gradient-ascent-20-0.0.txt" width="500px"></object>

#### 数据量 200:200

训练结果：

![200:200](./images/gradient-ascent-200-0.0.png)

<object data="./training_results/gradient-ascent-200-0.0.txt" width="500px"></object>

### 带惩罚项的梯度上升法

惩罚项均取 1.2。

#### 数据量 20:20

训练结果：

![20:20-1.2](./images/gradient-ascent-20-1.2.png)

<object data="./training_results/gradient-ascent-20-1.2.txt" width="500px"></object>

#### 数据量 200:200

训练结果：

![200:200-1.2](./images/gradient-ascent-200-1.2.png)

<object data="./training_results/gradient-ascent-200-1.2.txt" width="500px"></object>

### 牛顿法

采用服从与梯度上升法相同的分布的数据进行实验，同时增加了一组数据量为 $400$ 的，服从下面的分布的数据进行实验：

$$
第 0 类(Y = 0)：\mathrm{\mathbf{X}} \sim \mathcal{N(\begin{pmatrix}
  30 \\ 40
\end{pmatrix}
  , \mathrm{\begin{pmatrix}
    1 & 0 \\
    0 & 5
  \end{pmatrix}})} \\

第 1 类(Y = 1)：\mathrm{\mathbf{X}} \sim \mathcal{N(\begin{pmatrix}
  70 \\ 80
\end{pmatrix}, \mathrm{\begin{pmatrix}
    1 & 0 \\
    0 & 5
  \end{pmatrix}})}
$$

#### 数据量 20:20

训练结果：

![20:20](./images/newton-method-20-0.0.png)

<object data="./training_results/newton-method-20-0.0.txt" width="500px"></object>

#### 数据量 200:200

训练结果：

![200:200](./images/newton-method-200-0.0.png)

<object data="./training_results/newton-method-200-0.0.txt" width="500px"></object>

#### 数据量 400:400

训练结果：

![400:400](./images/newton-method-400-0.0.png)

<object data="./training_results/newton-method-400-0.0.txt" width="500px"></object>

### 带惩罚项的牛顿法

惩罚项均取 1.2。

#### 数据量 20:20

训练结果：

![20:20-1.2](./images/newton-method-20-1.2.png)

<object data="./training_results/newton-method-20-1.2.txt" width="500px"></object>

#### 数据量 200:200

训练结果：

![200:200-1.2](./images/newton-method-200-1.2.png)

<object data="./training_results/newton-method-200-1.2.txt" width="500px"></object>

#### 数据量 400:400

训练结果：

![400:400](./images/newton-method-400-1.2.png)

<object data="./training_results/newton-method-400-1.2.txt" width="500px"></object>

### UCI 数据测试

训练结果：

![200:200](./images/newton-method-42-0.0.png)

图片中由于只画了前两维的数据，看上去没有分开，但在高纬空间是分开了的。错误率约为 8%。

<object data="./training_results/newton-method-42-0.0.txt" width="500px"></object>

## 结论

1. 逻辑回归使用牛顿法比梯度下降快很多。
2. 为了得到线性分类边界，我们必须使数据服从高斯分布，但是经过实际测量，当不满足朴素贝叶斯假设，得到的结果人仍然较好。
3. 黑塞矩阵的计算复杂度比较高，但是牛顿法下降的速率快，因此还是更加优。
4. 逻辑回归能够很好地处理高维数据。

## 参考文献

1. **[Bishop 2006]** Christopher M. Bishop, Pattern Recognition and Machine Learning, Springer, 2006.
2. **[[Andrew Ng](https://www.coursera.org/learn/machine-learning)]** Machine Learning, Coursera
3. **[[Logistic regression](https://en.wikipedia.org/wiki/Logistic_regression)]** Logistic regression, Wikipedia
4. **[[Logistic function](https://en.wikipedia.org/wiki/Logistic_function)]** Logistic function, Wikipedia
5. **[[Newton's method](https://en.wikipedia.org/wiki/Newton%27s_method)]** Newton's method, Wikipedia

## 源代码

参见 https://github.com/upupming/logistic-regression