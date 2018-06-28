---
title: 如何写 Javadoc
tags:
---

这几天在研究数据类型的可变性(mutable)和(immutable)，并由此引出了表示不变量(Rep Invariants)、抽象函数(Abstraction function)这些概念，体会到了注释的重要性，借此机会正好总结一下如何写好 Javadoc 。

## 为什么要写注释

在写 Java 代码的时候，我们经常会感觉根本不需要去看注释就能理解一个方法做了什么。比如`String`的`toLowerCase()`、`Collection`的`contains()`，一看便知它们的作用，再加上参数类型与返回值类型，我们一般都能正确地调用它们。从 Java 内部方法取名的方式上我们能明白，有时候方法名也能成为某种意义上的注释。当然了，为了准确了解这个方法做了什么，还是得仔细阅读注释的。

有时候会有这种情况发生：你看自己一段时间之前的代码时，会感觉那时候自己实在是太“蠢”了，然后尝试优化曾经的实现，结果在优化过程中突然想起来，原来现在的想法自己曾经想过，只不过最终因为实现困难而放弃了。如果你之前写好了注释的话，这样的情况就不会发生了。这些精妙之处以及你最终是如何决定实现方法的都值得注释。好的注释能让人一眼就能看出代码的本意。

## 如何写注释

在 Eclipse 中，按住 Ctrl 键并单击某个类名，即可以看到这个类的实现代码，我们来看看`String`的注释：
```java
/**
 * The {@code String} class represents character strings. All
 * string literals in Java programs, such as {@code "abc"}, are
 * implemented as instances of this class.
```
`{@code }`表示一段代码。

```java
 * <p>
 * Strings are constant; their values cannot be changed after they
 * are created. String buffers support mutable strings.
 * Because String objects are immutable they can be shared. For example:
 * <blockquote><pre>
 *     String str = "abc";
 * </pre></blockquote><p>
 * is equivalent to:
 * <blockquote><pre>
 *     char data[] = {'a', 'b', 'c'};
 *     String str = new String(data);
 * </pre></blockquote><p>
 * Here are some more examples of how strings can be used:
 * <blockquote><pre>
 *     System.out.println("abc");
 *     String cde = "cde";
 *     System.out.println("abc" + cde);
 *     String c = "abc".substring(2,3);
 *     String d = cde.substring(1, 2);
 * </pre></blockquote>
 ```
 Javadoc 是以 html 语法写的，这部分渲染出来的效果如下：
[ ![string](./String-1.png)][javadoc-string]
 
 ```java
 * <p>
 * The class {@code String} includes methods for examining
 * individual characters of the sequence, for comparing strings, for
 * searching strings, for extracting substrings, and for creating a
 * copy of a string with all characters translated to uppercase or to
 * lowercase. Case mapping is based on the Unicode Standard version
 * specified by the {@link java.lang.Character Character} class.
 * <p>
 * The Java language provides special support for the string
 * concatenation operator (&nbsp;+&nbsp;), and for conversion of
 * other objects to strings. For additional information on string
 * concatenation and conversion, see <i>The Java&trade; Language Specification</i>.
 *
 * <p> Unless otherwise noted, passing a {@code null} argument to a constructor
 * or method in this class will cause a {@link NullPointerException} to be
 * thrown.
 *
 ```
 这里的`{@link}`可以链接到另一个类，`Java&trade`表示`Java™`。
 
 ```java
 * <p>A {@code String} represents a string in the UTF-16 format
 * in which <em>supplementary characters</em> are represented by <em>surrogate
 * pairs</em> (see the section <a href="Character.html#unicode">Unicode
 * Character Representations</a> in the {@code Character} class for
 * more information).
 * Index values refer to {@code char} code units, so a supplementary
 * character uses two positions in a {@code String}.
 * <p>The {@code String} class provides methods for dealing with
 * Unicode code points (i.e., characters), in addition to those for
 * dealing with Unicode code units (i.e., {@code char} values).
 *
 * <p>Unless otherwise noted, methods for comparing Strings do not take locale
 * into account.  The {@link java.text.Collator} class provides methods for
 * finer-grain, locale-sensitive String comparison.
 *
 * @implNote The implementation of the string concatenation operator is left to
 * the discretion of a Java compiler, as long as the compiler ultimately conforms
 * to <i>The Java&trade; Language Specification</i>. For example, the {@code javac} compiler
 * may implement the operator with {@code StringBuffer}, {@code StringBuilder},
 * or {@code java.lang.invoke.StringConcatFactory} depending on the JDK version. The
 * implementation of string conversion is typically through the method {@code toString},
 * defined by {@code Object} and inherited by all classes in Java.
 *
 ```
 
 ```java
 * @author  Lee Boynton
 * @author  Arthur van Hoff
 * @author  Martin Buchholz
 * @author  Ulf Zibis
 * @see     java.lang.Object#toString()
 * @see     java.lang.StringBuffer
 * @see     java.lang.StringBuilder
 * @see     java.nio.charset.Charset
 * @since   1.0
 * @jls     15.18.1 String Concatenation Operator +
 */

public final class String

```
注释最后是`@author`、`@see`、`@since`、`jls`，分别对应下图：
![string](./String-2.png)

可以总结以下几点：
+ 注释第一行以`/**`开头
+ 从 Javadoc 1.4 起，行首的`*`可以省略，大大方便直接粘贴`<pre>`标签
+ 第一句话精简扼要
+ 各种内联标签`{@link URL}`、`{@code }`等等，使用 Eclipse 可以自动补全
+ `<p>`可以用来另起一段
+ `@`只作用于一行
+ 注释以`*/`结尾

知道这些最基本的格式之后，就可以开始写自己的注释了。写的时候可以多模仿 Java 的官方文档。

最后可以在 Eclipse 的 `Prooject > generate Javadoc...`中生成 html 文件。
![](./generate.png)

期间遇到了一个问题：
```
Building tree for all the packages and classes...
/mnt/DATA/Documents/2018春/软件构造/github/Lab2-1160300625/src/P1/poet/GraphPoet.java:27: error: bad use of '>'
 * <ul><li> ("hello,") -> ("hello,")   with weight 2
```
可是我看了看[ MIT 生成的 Javadoc][MIT-graph]并没此问题，我发现其实[相应的 html ](/javadoc/index.html)也生成好了，这个`>`符号的问题暂且忽略，我也谷歌了一下，没有看到很好的解决方案。


[javadoc-string]: https://docs.oracle.com/javase/9/docs/api/java/lang/String.html
[MIT-graph]: http://web.mit.edu/6.031/www/sp17/psets/ps2/doc/index.html?poet/GraphPoet.html
