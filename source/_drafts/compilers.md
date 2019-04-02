---
title: compilers
tags:
---

## 布尔表达式的代码生成

布尔表达式常用于流程控制语句，比如 `if`、`while` 和 `for` 语句，这种布尔表达式作用可由式子被计算之后程序所处的位置来表示。

跳转语句可以无需计算整个表达式的值而直接跳转，比如：

```c
if (p && (p->next)) { p = p->next;}
```

当 `p` 为 `false` 时，可以直接跳出语句块。

```txt
S->if E then S
S->if E then S else S
S->while E do S
```

属性：

- `E.true`: `E` 为 `true` 时，控制流的标签
- `E.false`: `E` 为 `false` 时，控制流的标签
- `*.code`: `*` 的 [3 地址码](https://www.geeksforgeeks.org/three-address-code-compiler/)
- `*.next`: 在 `*` 的 3 地址码之后的 3 地址码
- `*.place`: 存储指向 `E` 在符号表的值的指针
- `gen(...)`: 返回 3 地址码
- `||`： 被用于连接 3 地址码。
- `newtemp`: 返回新的临时变量
- `newlabel`: 返回新的标签

![20190402204832.png](https://i.loli.net/2019/04/02/5ca35a2c28554.png)

1. `E1` 为 `true` 时，控制流的标签为 `newlabel`
2. `E1` 为 `false` 时，控制流的标签等于 `E` 为 `false` 时控制流的标签
3. `E2` 为 `true` 时，控制流的标签等于 `E` 为 `true` 时控制流的标签
4. `E2` 为 `false` 时，控制流的标签等于 `E` 为 `false` 时控制流的标签
5. `E` 的 3 地址码代码等于先计算 `E1` 的 3 地址码，再计算 `E1.true` 的 3 地址码，最后计算 `E2` 的 3 地址码

### 参考资料

1. [16IRGeneration.pdf](https://www.cse.iitk.ac.in/users/karkare/cs335/lectures/16IRGeneration.pdf)
2. [L11.pdf](https://webcourse.cs.technion.ac.il/236360/Winter2004-2005/ho/WCFiles/L11.pdf)
3. [lecture22.ppt](http://www.cs.fsu.edu/~xyuan/cot5300/lecture22.ppt)