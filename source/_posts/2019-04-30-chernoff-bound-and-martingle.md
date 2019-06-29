---
title: 切尔诺夫界、鞅
tags:
  - randomized algorithm
categories:
  - 算法
  - 随机算法
date: 2019-04-30 15:48:58
---

之前老师讲过[两个不等式](/2019/03/20/inequality-in-randomized-algorithm)：

1. 马尔科夫不等式

    $$
    P(X \ge t) \le \frac{E(X)}{t}
    $$

2. 切比雪夫不等式

    令 $Y = [X-E(X)]^2$

    $$
    P(Y \ge t^2) \le \frac{E(Y)}{t^2} = \frac{D(X)}{t^2}
    $$

随机变量偏离它的期望一个给定的值的概率，被称为偏差的尾概率(tail probability)。尾概率的计算方式除了利用已知条件直接计算以外，还有很多『模板』可以使用，就包括：

1. 马尔科夫（Markov）不等式
2. 切比雪夫（Chebyshev）不等式
3. 切尔诺夫（Chernoff）界

简单来说尾概率就是 $P(X > t)$ 的范围主要由计数计算概率法和利用数字特征计算的方法。

这篇文章将详细介绍切尔诺夫界，以及鞅的相关概念和应用。

- 切尔诺夫界：『独立随机变量的和』的分布的尾概率的一般的界，通过矩生成函数得到，有『切尔诺夫型』、『指数形式』尾概率界等。
- 鞅：对不能抽象为『独立随机变量的和』的应用场景，鞅可以得到随机变量偏离期望的程度的界。

<!-- more -->

## 切尔诺夫界

### 矩生成函数

定义：随机变量 $X$ 的矩生成函数是关于实数 $t$ 的函数：

$$
M_X(t) = E\left[e^{t X}\right]
$$

由[麦克劳林级数](https://en.wikipedia.org/wiki/Taylor_series#Exponential_function)可知

$$
\begin{aligned}
E\left[e^{t X}\right]
&= E\left[
    \sum_{k=0}^{\infty} \frac{(tX)^k}{k!}
    \right] \\
&=  \sum_{k=0}^{\infty}\frac{t^k}{k!}E\left(X^k\right)
\end{aligned}
\tag{1}
$$

将 $(1)$ 式对 $t$ 求 $n$ 阶导，并令 $t = 0$，可以得到 $X$ 的各阶矩。

$$
\begin{aligned}
M_X^{(n)}(t) &= E(X^n) + \frac{1}{1}tE(X^{n+1}) + \frac{1}{2}t^2E(X^{n+2}) + \cdots \\
M_X^{(n)}(0) &= E(X^n)
\end{aligned}
$$

（另外一种更简单的证明在《概率与计算》上，直接利用期望和微分运算可以交换的性质。）

矩生成函数有下面几个性质：

1. **矩生成函数相同，则随机变量分布相同**。令 $X$ 和 $Y$ 是两个随机变量，如果对某个 $\delta > 0$，对于所有的 $t \in (-\delta, \delta)$ 有 $M_X(t) = M_Y(t)$，那么 $X$ 和 $Y$ 有相同的分布。
2. 随机变量的各阶矩相同，则这两个随机变量分布相同。
3. 独立随机变量的和的矩生成函数等于各自生成函数的积。

    $$
    E[e^{t(X+Y)}] = E[e^{tX} \cdot e^{tX}] = E[e^{tX}] \cdot E[e^{tY}]
    $$

#### 两点分布和二项分布的矩生函数

投掷一枚硬币，结果用 $X$ 表示，正面朝上的概率为 $p$；投掷 n 次的总结果用 $Y$ 表示。

$$
\begin{aligned}
M_X(t)
&= E(e^{tX}) \\
&= p \cdot e^{t\cdot 1} + (1-p) \cdot e^{t\cdot 0} \\
&= 1-p+pe^t
\end{aligned}
\tag{2}
$$

我们可以利用 $(2)$ 计算 $X$ 的一阶矩（均值）和二阶矩，从而得到方差。

$$
E(X) = M_X^{(1)}(0) = \left(pe^t\right)|_{t=0} = p
$$

$$
E(X^2) = M_X^{(2)}(0) = \left(pe^t\right)|_{t=0} = p
$$

$$
D(X) = E(X^2) - E^2(X) = p - p^2 = p(1-p)
$$

再来计算 $Y$ 的矩生成函数，$Y$ 是由 $n$ 个独立同分布的 $X$ 得来的。两个独立随机变量之和的生成函数等于这两个随机变量的矩生成函数之积：

$$
\begin{aligned}
M_Y(t)
&= E(e^{tY}) \\
&= E\left(e^{t\sum_i^{n}{X_i}}\right) \\
&= E\left({e^{tX_i}}^n\right) \\
&= E\left({e^{tX_i}}\right)^n \\
&= [M_X(t)]^n \\
&= (1-p+pe^t)^n
\end{aligned}

\tag{3}
$$

$$
M_Y^{(1)}(t) = n(1-p+pe^t)^{n-1} \cdot pe^t = npe^t(1-p+pe^t)^{n-1}
$$

求导：

$$
\begin{aligned}
M_Y^{(2)}(t)
&= npe^t(1-p+pe^t)^{n-1} + npe^t \cdot (n-1)(1-p+pe^t)^{n-2} \cdot pe^t \\
&= npe^t(1-p+pe^t)^{n-1} + n(n-1)p^2e^{2t} \cdot (1-p+pe^t)^{n-2} \\
\end{aligned}
$$

取在 $t=0$ 处的值：

$$
E(Y) = [npe^t(1-p+pe^t)^{n-1}]|_{t=0} = np(1-p+p) = np
$$

$$
\begin{aligned}
E(Y^2)
&= [npe^t(1-p+pe^t)^{n-1} + n(n-1)p^2e^{2t} \cdot (1-p+pe^t)^{n-2}]_{t=0} \\
&= np + n(n-1)p^2
\end{aligned}
$$

计算方差：

$$
\begin{aligned}
D(Y)
&= E(Y^2) - E^2(Y) \\
&= [np + n(n-1)p^2] - (np)^2\\
&= np + n^2p^2 - np^2 - n^2p^2 \\
&= np(1-p)
\end{aligned}
$$

### 切尔诺夫界的导出

定理：$X_1, \cdots, X_n$ 是**独立泊松实验**，$P(X_i=1) = p_i$，$X=\sum_{i=1}^nX_i$，$\mu = E(X)$，则对任意 $\delta > 0$，有：

$$
P[X \ge (1+\delta)\mu] < \left[\frac{e^\delta}{(1+\delta)^{1+\delta}}\right]^{\mu}
$$

> 泊松实验并不是符合泊松分布的随机变量，而是 0-1 随机变量。在泊松试验中，随机变量的分布不必相等，伯努利试验是泊松试验的一种特殊情形，其中独立的 0-1 随机变量有相同的分布。可以看到定理中为每个实验用了不同 $p_i$ 表示其分布。

在 $\mu=50$ 时，右式图像大概如此（使用 https://www.desmos.com/calculator 绘制，只看 $\delta>0$ 部分）：

<img src="https://i.loli.net/2019/04/23/5cbef4e6d420c.jpg" alt="20190423192002-2019-4-23-19-20-5">

> 直观理解为：$X$ 的值超过其均值百分比 $\delta$ 的概率不会超过后面那一长串，而且后面那个式子在 $\delta = 0$ 时为 $1$，在 $\delta = \infty$ 时为 $0$，直观上很容易理解，也很好记。

切尔诺夫界提供了估计尾概率 $P(X>t)$ 的新工具，虽然我们之前已经有了类似的工具（Markov、Chebyshev），但是这个结果更加精确。

先给出定理，再给出证明经常是一个很好的教学模式，我们接下来证明这个定理。

1. 计算 $X$ 的矩生成函数

    $$
    \begin{aligned}
    M_X(t)
    &\xlongequal{独立性} \prod_{i=1}^{n} M_{X_i}(t) \\
    \end{aligned}
    \tag{4}
    $$

    其中

    $$
    \begin{aligned}
    M_{X_i}(t)
    &= P(X_i=1)e^{t\cdot 1} + P(X_i=0)e^{t\cdot 0} \\
    &= p_ie^t + (1-p_i)e^0 \\
    &= 1-p_i + p_ie^t \\
    &\le e^{p_i(e^t-1)}, 这里用到了 1 + x \le e^x 在 R 上恒成立的条件
    \end{aligned}
    $$

    将放缩应用于 $(4)$ 式，得到一个比较好的形式：
    $$
    \begin{aligned}
    M_X(t)
    &\xlongequal{独立性} \prod_{i=1}^{n} M_{X_i}(t) \\
    & \le \prod_{i=1}^{n} e^{p_i(e^t-1)} \\
    &= \exp\{(e^t-1)\sum_{i=1}^np_i\} \\
    &= \exp \{(e^t-1)\mu\}, 这里用到了 \mu = E(X) = p_1 + \cdots + p_n
    \end{aligned}
    $$

2. 要计算 $P(X \ge t)$，等价于计算 $P(h(X) \ge h(t))$（在 $h$ 是增函数时）。应用 Markov 不等式 $P[h(X) \ge h(t)] \le \frac{E[h(X)]}{h(t)}$

    $$
    \begin{aligned}
    P(X > t)
    &= P(e^{\lambda X} > e^{\lambda t}),注意 \lambda >0 满足增函数 \\
    &\le \frac{E(e^{\lambda X})}{e^{\lambda t}} , 对随机变量 e^{\lambda X} 应用 Markov 不等式 \\
    &\le \frac{\exp \{(e^\lambda-1)\mu\}}{\exp {\lambda t}}
    \end{aligned}
    $$

    这里要尽量求出小的上界，因此取一个极小值：

    $$
    \begin{aligned}
    P(X > t)
    &\le \min_{\lambda > 0} \frac{\exp \{(e^\lambda-1)\mu\}}{\exp {\lambda t}}
    \end{aligned}
    $$

3. 针对 $t$ 进行优化，得出结论

    令 $t = (1+\delta)\mu$（为什么，因为概率内部取的是大于号 $X >t$，所以求偏离均值以上更有用，这样后面的 $\lambda$ 取特殊值才能保证是大于 0 的），有

    $$
    \begin{aligned}
    P[X > (1+\delta)\mu]
    &\le \min_{\lambda > 0} \frac{\exp \{(e^\lambda-1)\mu\}}{\exp \{\lambda (1+\delta)\mu\}} \\
    &令 \lambda = \ln(\delta+1)，既然小于所有中最小的，肯定也小于特例, \delta >0 \\
    & \le \frac{e^{\delta\mu}}{(1+\delta)^{(1+\delta)\mu}} \\
    &= \left[\frac{e^{\delta}}{(1+\delta)^{(1+\delta)}}\right]^\mu \\
    \end{aligned}
    \tag{5}
    $$

切尔诺夫界得证，在第 2 步中如果令 $\lambda < 0$，并在第 3 步令 $\lambda = \ln (1-\delta)$（$\delta \in (0, 1)$） 还会得到另外一个形式：

$$
P[X \le (1-\delta)\mu] \le \left[\frac{e^{\delta}}{(1-\delta)^{(1-\delta)}}\right]^\mu \\
\tag{6}
$$

式 $(5)$ 和式 $(6)$ 总结起来就是：

$$
\begin{cases}
P[X > (1+\delta)\mu] \le \left[\frac{e^{\delta}}{(1+\delta)^{(1+\delta)}}\right]^\mu, \delta > 0 \\
P[X \le (1-\delta)\mu] \le \left[\frac{e^{\delta}}{(1-\delta)^{(1-\delta)}}\right]^\mu, \delta \in (0, 1)

\tag{7}
\end{cases}
$$

### 切尔诺夫界的常用形式

式 $(7)$ 虽然精确，但是计算较复杂，我们可以得出一个可以忍受的、不太精确但是计算量较小的尾不等式：

$$
\begin{cases}
P[X > (1+\delta)\mu] \le \left[\frac{e^{\delta}}{(1+\delta)^{(1+\delta)}}\right]^\mu \le \exp {\frac{-\mu\delta^2}{3}}, \delta \in (0, 1)（注意这里条件更强，限制 \delta 必须小于 1，下同）  \\
P[X \le (1-\delta)\mu] \le \left[\frac{e^{\delta}}{(1-\delta)^{(1-\delta)}}\right]^\mu \le \exp {\frac{-\mu\delta^2}{2}}, \delta \in (0, 1)

\tag{8}
\end{cases}
$$

> 又是先给结论再证明，真的不知道前辈们是怎么想出这个结论的，一定是数学思维超级好！

要证明 $\left[\frac{e^{\delta}}{(1+\delta)^{(1+\delta)}}\right]^\mu \le \exp {\frac{-\mu\delta^2}{3}}, \delta >0$，取对数，等价于证明：

$$
\mu \ln \left[\frac{e^{\delta}}{(1+\delta)^{(1+\delta)}}\right] \le {\frac{-\mu\delta^2}{3}}
$$

令 $f(\delta) = (左边 - 右边)/\mu$，要证明 $f(\delta) \le 0$，由于 $f(0) = 0$，只需要证明 $f'(\delta) < 0$。求导即可。

$$
\begin{aligned}
f(\delta)
&= \delta - (1+\delta)\ln (1+\delta) + {\frac{\delta^2}{3}} \\
&= \frac{\delta^2}{3} + \delta - (1+\delta)\ln(1+\delta) \\
\end{aligned}
$$

$$
\begin{aligned}
f'(\delta)
&= \frac{2}{3}\delta + 1 - \ln (1+\delta) - (1+\delta)\frac{1}{1+\delta} \\
&= \frac{2}{3}\delta-\ln (1+\delta)
\end{aligned}
$$

要证明 $f'(\delta)>0$，需要进一步求导，得到：

$$
f''(\delta) = \frac{2}{3} - \frac{1}{1+\delta}
$$

$f''(\delta)$ 是增函数，由于规定 $\delta \in (0, 1)$，所以 $f'' \in (-\frac{1}{3}, \frac{1}{6})$，因此 $f'$ 先减后增，要证明 $f' < 0$，只需求证两个端点 $f(0)$ 和 $f(1)$ 即可。

同样的可以证明第二种情况。

最终我们还可以将两者综合运用，得到一个更好的式子，『偏离均值』=『偏离均值之下』或者『偏离均值之下』。

$$
\begin{aligned}
P[|X-\mu|\ge \delta\mu]
& \le P[X \le (1-\delta)\mu] + P[|X \ge (1+\delta)\mu] \\
&= \exp {\frac{-\mu\delta^2}{2}} + \exp {\frac{-\mu\delta^2}{3}} \\
&= a +b \\
&\le 2b \\
&= 2\exp {\frac{-\mu\delta^2}{3}} \\
\tag{9}
\end{aligned}
$$

可以看到限制 $\delta < 1$ 之后，我们得到了分母带 3 的那个结论，我们可以进一步限制 $t > 2e\mu$，得到更简洁的结论。

$$
P(X > t) < 2^{-t}
\tag{10}
$$

证明：设 $t = (1+\delta)\mu$，对于 $t \ge 2e\mu$，$\delta+1 = \frac{t}{\mu} \ge 2e$。因此，

$$
\begin{aligned}
P[X \ge (1+\delta)\mu]
&\le \left(\frac{e^\delta}{(1+\delta)^{1+\delta}}\right)^\mu \\
&\le \left(\frac{e^{\delta+1}}{(1+\delta)^{1+\delta}}\right)^\mu \\
&= \left(\frac{e}{1+\delta}\right)^{(1+\delta)\mu} \\
& \le 2^{-(1+\delta)\mu} \\
&= 2^{-t}
\end{aligned}
$$

### 切尔诺夫界的简单应用

#### 成功实验的总次数

独立同分布重复均匀硬币硬币 Bernoulli 实验 $n$ 次，$X_i=1$ 表示第 $i$ 次实验成功，$X$ 表示成功实验的总次数。$X = \sum_{i=1}^n X_i$，$E(X) = nE(X_i) = \frac{n}{2}$。

> 这里有更强的条件，如上文所述，伯努利试验是泊松实验的特殊形式。

使用 $(9)$ 式，我们可以得到：

$$
\begin{aligned}
P[|X-\mu|\ge\delta\mu]
&\le 2 \exp \{\frac{-\mu\delta^2}{3}\} \\
P[|X-\frac{n}{2}|\ge\frac{1}{2}\mu] &\le 2 \exp \{-\frac{\mu}{12}\} = 2\exp \{ -\frac{n}{24} \} \\
\end{aligned}
$$

我们得到的这个不等式的意思是：成功实验的总次数 $X$ 均值为 $\frac{n}{2}$，$X$ 的实际取值偏离均值 50% 的概率不超过 $2\exp \{ -\frac{n}{24} \}$。

#### 算法重复遍数

曾经我们讲过[拉斯维加斯算法](/2019/03/20/las-vegas-monte-carlo-yao-etc)，它的特点是：

1. 得到的解一定是正确的，
2. 运行时间不确定，运行时间与运行一次能够得到解得的概率 $p$ 有关。

之前举的是 LASYSELECT 的例子，算法的目的是从 $S$ 中选出第 k 小的元素，算法运行一遍得到解的概率为 $p$重复调用算法知道得到问题的解所需要的运行次数我们设为随机变量 $X$，$X$ 服从几何分布。

$$
E(X) = \frac{1}{p}
$$

我们现在求一个对算法运行次数的估计范围，运行次数在这个范围内的概率足够大，以至于我们可以认为算法运行次数基本就是此范围。

> 老师课件中此处有错误，下面是我的证明。

由切尔诺夫界：

$$
E(|X-\mu|\ge \delta \mu) < 2 \exp \left\{-\mu\delta^2/3\right\} = p_0, \mu = \frac{1}{p}
$$

解得：

$$
\delta_0 = \sqrt{-3p(\ln p_0- \ln 2)}
$$

结论：算法运行遍数以 $1-p_0$ 的概率介于 $(1-\delta_0)\mu$ 和 $(1+\delta_0)\mu$ 之间。

#### 参数估计

某基因突变的概率为 $p$（未知），我们要用统计规律来估计 $p$，进行 $n$ 次实验，测得突变 $X$ 次，$q = X/n$，我们要判断：$q\approx p$ 可不可信？

我们要的结论是 $P(p \notin [q-\delta, q+\delta]) < 1-\gamma$，也就是说 $p$ 在区间 $[q-\delta, q+\delta]$ 之外的概率足够小，比如 $0.01$（$\gamma = 0.99$）。其中 $[q-\delta, q+\delta]$ 称为置信区间，$\gamma$ 称为置信水平。

我们要做的是将实验次数 $n$ 和置信水平 $\gamma$ 关联起来。

分成两半：

$$
\begin{aligned}
P(p \notin [q-\delta, q+\delta]) = P(p<q-\delta) + P(p>q+\delta)
\end{aligned}
$$

$$
p<q-\delta \Leftrightarrow p < X/n - \delta \Leftrightarrow X >  (p+\delta)n \Leftrightarrow X >  (1+\delta/p)pn
$$

$$
p>q+\delta \Leftrightarrow p > X/n + \delta \Leftrightarrow X <  (1-\delta/p)pn
$$

均值 $\mu = E(X) = pn$，因此有：

$$
\begin{aligned}
P(p \notin [q-\delta, q+\delta])
&= P[|X-\mu|>(\delta/p)\mu] \\
&\le 2\exp\{-\frac{\mu(\delta/p)^2}{3}\} \\
&= 2\exp\{ -\frac{n\delta^2}{3p}\} \\
&\le 2\exp\{ -\frac{n\delta^2}{3}\} \\
\end{aligned}
$$

1. 令其为 $1-\gamma$，解得 $\delta_0$，得到置信区间
2. 知道置信区间，直接计算出置信水平
3. 直到置信区间和置信水平，可以得到实验所需次数

注：老师课上推到的时候没有把大于和小于两种情况合并，所以结果是 $\exp\{ -\frac{n\delta^2}{2}\} +  \exp\{ -\frac{n\delta^2}{3}\}$，差别不会很大。

#### 【作业】 $\pi$ 值估计精度与抽样次数 $n$ 之间的关系

<img src="https://i.loli.net/2019/04/24/5cbf4e40e0ee2.jpg" alt="20190424014117-2019-4-24-1-41-19">

算法重述：

有一个半径为 $r$ 的圆及其外切四边形，向正方形随机投掷 $n$ 个点，设有 $X$ 个点落入圆内（$X$ 就是我们要考虑的随机变量），投掷点落入圆内的概率为 $(\pi r^2)/(4r^2) = \frac{\pi}{4}$。我们用 $X/n$ 逼近 $\pi/4$，即 $X/n = \pi/4$，于是 $\pi \approx (4X)/n$。

这与【参数估计】的例子是完全一样的，这里相当于重证一遍。

每一次投掷，落入圆形区域记为成功，概率为 $p$，显然 $p = \pi/4$。连续 $n$ 次实验，得到的对 $p$ 的估计值记为 $q = X/n$。

需要对不等式 $P(p \notin [q-\delta, q+\delta]) < 1-\gamma$ 进行求解。

分成两半：

$$
\begin{aligned}
P(p \notin [q-\delta, q+\delta]) = P(p<q-\delta) + P(p>q+\delta)
\end{aligned}
$$

上个问题中我们是合并求解的，现在把左半部分和右半部分分开求解，得到更精确的结论。

左半部分：

$$
p<q-\delta \Leftrightarrow p < X/n - \delta \Leftrightarrow X >  (p+\delta)n \Leftrightarrow X >  (1+\delta/p)pn
$$

因为 $\mu = pn$，所以：

$$
P(X >  (1+\delta/p)pn) = P(X >  (1+\delta/p)\mu) \le \exp \{-\frac{\mu(\delta/p)^2}{3}\} = \exp \{-\frac{pn(\delta/p)^2}{3}\} = \exp \{-\frac{n\delta^2}{3p}\}
$$

> 注意，这里是与老师唯一的区别，我们知道 $p = \frac{\pi}{4}$，所以不必再放缩消去 $p$，从而也会得到更加精确的结论。

右半部分：

$$
p>q+\delta \Leftrightarrow p > X/n + \delta \Leftrightarrow X <  (1-\delta/p)pn
$$

同样地，有：

$$
P(X <  (1-\delta/p)pn) = P(X <  (1-\delta/p)\mu) \le \exp \{-\frac{\mu(\delta/p)^2}{2}\} = \exp \{-\frac{pn(\delta/p)^2}{2}\} = \exp \{-\frac{n\delta^2}{2p}\}
$$

最终把它们加起来，有：

$$
\begin{aligned}
P(p \notin [q-\delta, q+\delta])
&= P(p<q-\delta) + P(p>q+\delta) \\
&\le \exp \{-\frac{n\delta^2}{3p}\} + \exp \{-\frac{n\delta^2}{2p}\} \\
&= \exp \{-\frac{4n\delta^2}{3\pi}\} + \exp \{-\frac{4n\delta^2}{2\pi}\}
\end{aligned}
$$

现在要的是『抽样次数 n』与『求解精度 $\delta$』之间的关系。

我们固定置信度为 $\gamma = 0.95$，得到 $n$ 与 $\delta$ 之间的隐函数关系：

$$
\exp \{-\frac{4n\delta^2}{3\pi}\} + \exp \{-\frac{4n\delta^2}{2\pi}\} = 1 - 0.95 = 0.05
$$

绘制图像如下：

<img src="https://i.loli.net/2019/04/24/5cbf58265f196.jpg" alt="20190424022331-2019-4-24-2-23-32">

<img src="https://i.loli.net/2019/04/24/5cbf5877963d3.jpg" alt="20190424022452-2019-4-24-2-24-54">

可以看到，随着 $n$ 的增加，置信区间缩小，精度越来越好，从网格中可以看出 $n=300$ 时精度达到了 $0.1$。

#### 【作业】快排的随机性

<img src="https://i.loli.net/2019/04/24/5cbf5cd25cc73.jpg" alt="20190424024326-2019-4-24-2-43-28">

> 这道题来自《概率与计算》习题 4.20，答案参见[这里](https://pdfs.semanticscholar.org/9d05/a3c5e24096b5bbea4178320091c9274340c3.pdf)。

(a)

用 $D(s)$ 表示 QuickSort 排序时所发生的动作对应的树的高度。我们用 $N(s)$ 表示排序 $s$ 个数对应的结点。对于树中有两个孩子 $N(a)$ 和 $N(s-a)$ 的结点 $N(s)$，我们有下面的递归等式：

$$
D(s) = \max \{D(a),D(s-a)\}+1
$$

其中 $D(1) = 1$，$D(s)$ 是关于 $s$ 的单调不减的函数。每次迭代 $D(s)$ 表示一个结点，此结点有两个孩子 $D(a)$ 和 $D(s-a)$。由题，一个结点 $N(s)$，带有两个孩子结点 $N(a)$ 和 $N(s-a)$，如果满足 $\max \{a, s-a\} \le 2s/3$，也就是说 $\max \{D(a), D(s-a)\} \le D(2s/3)$。因此对于一个好结点，我们有 $D(s) \le D(2s/3)+1$。这样，在任何路径上，从根结点到叶子结点的好结点的数量最多为 $\log_{3/2}n = \log_2(2/3)\cdot\log_2n$，取 $\log_2(2/3) \approx 0.631$ 为所要求的 $c_1$ 即可。

（b)

> 不超过，至少 <-> 超过，至多 <-> 切尔诺夫

令 $c_2 = 36$（也就是说，从树根到叶子的路径上所含结点的数量至少为 35）、$\delta = 9/20$。通过 $(a)$ 我们知道任意从根到叶子结点的路径上好结点的数量不超过 $c_1\log_2 n$，其中 $c_1 \approx 0.631$，可以推出坏结点的数量至少是 $35\log_2 n$。令 $X_i$ 表示一个指示随机变量，$X_i=1$ 表示第路径上第 $i$ 个结点是坏的，否则 $X_i=0$。我们要估计的概率就是 $P[X=\sum_{i=1}^{36\log_2 n}X_i \ge 35.369 \log_2 n]$。注意一个结点是好的当且仅当选中的基准元素大于等于第 $s/3$ 小的元素，或者小于等于第 $2s/3$ 小的元素。因此我们有 $P(X_i=1) \le 2/3, P(X_i=0)\ge 1/3$，$E(X_i) \le (2/3) \cdot 36\log_2 n = 24 \log_2 n$。另外，根据切尔诺夫界，我们有：

令 $\mu_H = 24 \log_2 n$，我们有：

$$
\begin{aligned}
P[X \ge 35.369 \log_2 n]
&\le P[X \ge 34.8 \log_2 n] \\
&= P[X \ge (1+\delta) \cdot \mu_H] \\
&\le \exp \{-\mu_H\delta^2/3\} \\
&= \exp \{-\frac{81}{50}\cdot\frac{\ln n}{\ln 2}\} \\
&\le n^{-2.337} \\
& < n^{-2}
\end{aligned}
$$

因此我们得到了所要求的概率 $1- 1/n^2$。

(c)

注意到树中从根到叶子结点的路径一共有 $n$ 条。用 $A_i$ 表示事件：在第 $i$ 条路径上结点的总数超过 $c_2\log_2 n$（$c_2$ 在 (b) 中确定为 36）。我们已经证明 $P(A_i) \le 1/n^2$。因此根据 union-bound，从根到叶子结点的最长的路中的结点数大于 $c_2\log_2 n$ 的概率为 $P(\cup_{i=1}^nA_i)$，至多是 $\sum_{i=1}^nP(A_i) = \frac{1}{n}$。得证。

(d)

用 $T(n)$ 表示 Quicksort 排序 $n$ 个数时用的时间，我们有：

$$
T(n) = T(a) + T(n-a) + O(n)
$$

其中 $O(n)$ 是基准元素和其他 $n-1$ 个元素进行比较时的时间开销。因为 Quicksort 算法的递归深度至多等于相应的树的从根到叶子结点的路上的结点数量，因为以 $1-\frac{1}{n}$ 的概率为 $O(\log n)$，通过使用递归树方法，分析可得以 $1-\frac{1}{n}$ 的概率 $T(n) = O(n\log n)$。

## 鞅

### 鞅的应用

随机变量序列 $X_0, X_1, X_2, \cdots$，如果满足

$$
E(X_i|X_0,X_1,\cdots,X_{i-1}) = X_{i-1}, \forall i \ge 1
$$

则称 $X_0, X_1, X_2, \cdots$ 是一个鞅。

#### 【习题】按照定义证明

<img src="https://i.loli.net/2019/04/24/5cbf6e494ac20.jpg" alt="20190424035759-2019-4-24-3-58-0">

根据定义，只需证明

$$
E(Y_i|Y_0,Y_1,\cdots,Y_{i-1}) = Y_{i-1}, \forall i \ge 1
$$

$$
\begin{aligned}
E(Y_i|Y_0,Y_1,\cdots,Y_{i-1})
&= E(2^i(1-X_i)|Y_0,Y_1,\cdots,Y_{i-1}) \\
&= 2^i - 2^iE[X_i|Y_0,Y_1,\cdots,Y_{i-1}]
\end{aligned}
$$

根据已知条件：

$$
\begin{aligned}
E(X_i|X_{i-1}) &= (X_{i-1}+1)/2
\end{aligned}
$$

因为 $Y_i$ 给定就相当于 $X_i$ 给定，所以：

$$
\begin{aligned}
E(Y_i|Y_0,Y_1,\cdots,Y_{i-1})
&= 2^i - 2^iE[X_i|X_0,X_1,\cdots,X_{i-1}] \\
&= 2^i - 2^iE[X_i|X_{i-1}] \\
&= 2^i - 2^i\frac{X_{i-1}+1}{2} \\
&\xlongequal{带回去} 2^i\left(1-\frac{1-\frac{Y_{i-1}}{2^{i-1}}+1}{2}\right) \\
&= Y_{i-1}
\end{aligned}
$$

#### 【习题】应用-分析时间复杂度

<img src="https://i.loli.net/2019/04/24/5cbf7955cd745.jpg" alt="20190424044506-2019-4-24-4-45-8">

步骤 4 处每次执行 goto 的条件为，从剩余的 n-(k-1) 个数中选取出的数小于之前抽取的数。

这是一个 Las Vegas 算法，假设每一次执行：

- 成功的概率为 $p$，所用的时间为 $O(n)$。
- 不成功的概率为 $1-p$，所用的时间为 $O(J_i)$，$i$ 表示第几次执行，其中 $J_i$ 为第一个满足 $y_k < y_{k-1}$ 的 $k$，$J$ 的期望为 $E(J_i)$。

由几何分布的性质，所需的运行次数 $X$ 的期望值为：

$$
E(X) = \frac{1}{p}
$$

算法运行所需的总时间等于不成功时所需要的时间加上最后一次成功时所需要的时间：

$$
T = \sum_{i=1}^{X-1}O(J_i) + O(n)
$$

因此算法运行的时间复杂度的期望为：

> 看[这里](https://math.stackexchange.com/questions/2245905/expectation-value-of-random-length-sum)，补习概率论知识，随机变量作 `sum` 的下标时该怎么办。
> $$
> E\left(\sum_{i=0}^N X_i\right) = \sum_n P(N=n) \, E\left(\sum_{i=0}^n X_i\right)
> $$

$$
\begin{aligned}
E(T)
&= E\left[\sum_{i=1}^{X-1}O(J_i) + O(n)\right] \\
&= E\left[\sum_{i=1}^{X-1}O(J_i)\right] + O(n) \\
&= \sum_{x} P(X=x)E\left(\sum_{i=1}^{x-1}O(J_i) \right) + O(n) \\
& 每一轮运行 J 的均值都是一样的，记为 E(J) \\
&= \sum_{x} P(X=x)(x-1)O\left[E(J) \right] + O(n) \\
&= O\left[E(J) \right]\sum_{x} P(X=x)(x-1) + O(n) \\
&= O\left[E(J) \right][E(X)-1] + O(n) \\
&= O[E(J)](\frac{1}{p}-1) + O(n) \\
\end{aligned}
$$

下面计算概率值：

1. 所有可能的排序中只有 1 种是正确的（不考虑元素相等的情况），成功的概率 $p = \frac{1}{n!}$。
2. 『第 $i$ 元素才开始打破有序性，前 $(i-1)$ 个元素均有序』的概率为 $P(J = i)$，前 $(i-2)$ 个元素只有 1 种排法，第 $(i-1)$ 个元素有两种排法，其中一种排法不管第 $i$ 个元素选择什么都会打破有序性，另外一种排法要打破有序性必须第 $i$ 个元素只有 $(n-i)$ 种排法，第 $(i+1)$ 个及后面的元素排法任意，$P(J = i) = \frac{[(n-i+1)! + (n-i)(n-i)!]}{n!} < \frac{2(n-i+1)!}{(n)!}$。因此 $E(J) = \sum_{j=2}^{n}P(J=j) j < \sum_{j=2}^{n}\frac{2(n-j+1)!}{n!}j \le \sum_{j=2}^{n}\frac{2(n-2+1)!}{n!}j \le \sum_{j=2}^{n}j = \frac{(n-1)(n+2)}{2}$

最后得到平均时间复杂度为：

$$
\begin{aligned}
E(T)
&= O\left( \sum_{j=2}^n\frac{j}{C_n^j}(n!-1) + n \right) \\
&\le O\left[ O(n)(n!-1) + n \right] \\
&= O[(n+1)!]
\end{aligned}
$$

> 虽然刚开始做出来了，后来却发现老师要求使用鞅的知识，所以看了一下课本，在《概率与计算》中有一道习题 12.12 和这个是一样的，不过并没有找到答案。

同样用 $J_i$ 表示每次运行算法不成功时用去的时间，$X$ 表示成功时的总尝试次数。在这个式子的基础上：

$$
T = \sum_{i=1}^{X-1}O(J_i) + O(n)
$$

往瓦尔德方程的路子上靠，我们可以尝试去证明 $X$ 是 $J = \{J_1, J_2\cdots\}$ 的一个停时。

不同的 $J_i$ 之间是相互独立的，有 $E(J_i) = E(J_{i-1})$，所以 $J_1, \cdots$ 是一个鞅。而且 $X=x$（$X-1=x-1$） 仅依赖于 $J_1, \cdots, J_{x}$，所以 $X-1$ 是鞅 $J$ 的一个停时。

所以有：

$$
E[\sum_{i=1}^{X-1}O(J_i)] = E(X-1)\cdot E(J)
$$

其余证明过程不变。
