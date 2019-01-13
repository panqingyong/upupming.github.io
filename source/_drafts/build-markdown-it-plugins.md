---
title: 如何编写 markdown-it 插件
tags:
---

markdown-it 是很有名的 Markdown 解析器。我最早接触它是在使用 VS Code 的时候用到了插件 Markdown All in One，它对 LaTeX 数学公式的解析非常强大，于是就研究了一下源代码，发现 VS Code 里面用的就是 markdown-it 解析器，支持丰富的插件拓展。

因为自己平时数学公式写的比较多，这段时间一直想着移植一下 Markdown All in One 里面用到的 markdown-it 插件 markdown-it-katex，让自己的 docsify 项目也能够完美地支持 LaTeX 语法。但是遇到了许多问题，主要是因为 docsify 使用的是 marked 作为 Markdown 解析器，但是目前对 marked 不是很熟悉，也没有见过/用过 marked 的 MathJax 或者 KaTeX 插件。因此打算用 markdown-it 加上现成的插件实现，但是必须在现有插件的基础上稍加修改，所以就特地学习、整理了一下 markdown-it 插件编写的过程，目前这方面的资料比较少，希望对读者有所帮助。

<!-- more -->

## 典范插件

markdown 最经典的插件应该是 [markdown-it-emoji](https://github.com/markdown-it/markdown-it-emoji) 了，具有参考价值。两款 VS Code 插件 Markdown All in One 和 Markdown+Math 的开发者分别使用的是插件 [markdown-it-katex](https://github.com/upupming/markdown-it-katex) 和 [markdown-it-texmath](https://github.com/goessner/markdown-it-texmath)，都是基于 KaTeX 进行 LaTeX 解析的。

## 参考资料

1. [markdown-it](https://github.com/markdown-it/markdown-it)
2. [Language Features for Markdown files](https://github.com/Microsoft/vscode/tree/master/extensions/markdown-language-features)
3. [Markdown All in One](https://github.com/neilsustc/vscode-markdown)
4. [markdown-it-katex](https://github.com/upupming/markdown-it-katex)