---
title: 解决 Unchecked cast from Object to Edge
categories: 
- 编程语言
- Java
tags:
  - java
date: 2018-03-26 22:27:06
---

对于从`Object`到泛型的类型转换，遇到警告*Type safety: Unchecked cast from Object to Edge<L>*，解决方案是修改转换的类型为通配符类型：
```java
Edge<?> other = (Edge<?>) otherObject;
```
具体分析见下文。

<!-- more -->

## 重写`equals` 

新写的类最好要重写(Override) `equals()`以及`hashCode()`，以便其它方法的调用，比如说`Collection`的`contains()` 、`HashSet`的查找等。
## `String`类

先来看看`String`类对这两个方法的重写。

`String`的`equals`：
```java
/**
 * Compares this string to the specified object.  The result is {@code
 * true} if and only if the argument is not {@code null} and is a {@code
 * String} object that represents the same sequence of characters as this
 * object.
 *
 * <p>For finer-grained String comparison, refer to
 * {@link java.text.Collator}.
 *
 * @param  anObject
 *         The object to compare this {@code String} against
 *
 * @return  {@code true} if the given object represents a {@code String}
 *          equivalent to this string, {@code false} otherwise
 *
 * @see  #compareTo(String)
 * @see  #equalsIgnoreCase(String)
 */
public boolean equals(Object anObject) {
    if (this == anObject) {
        return true;
    }
    if (anObject instanceof String) {
        String aString = (String)anObject;
        if (coder() == aString.coder()) {
            return isLatin1() ? StringLatin1.equals(value, aString.value)
                              : StringUTF16.equals(value, aString.value);
        }
    }
    return false;
}
```
`String`的`hashCode`：
```java
/**
 * Returns a hash code for this string. The hash code for a
 * {@code String} object is computed as
 * <blockquote><pre>
 * s[0]*31^(n-1) + s[1]*31^(n-2) + ... + s[n-1]
 * </pre></blockquote>
 * using {@code int} arithmetic, where {@code s[i]} is the
 * <i>i</i>th character of the string, {@code n} is the length of
 * the string, and {@code ^} indicates exponentiation.
 * (The hash value of the empty string is zero.)
 *
 * @return  a hash code value for this object.
 */
public int hashCode() {
    int h = hash;
    if (h == 0 && value.length > 0) {
        hash = h = isLatin1() ? StringLatin1.hashCode(value)
                              : StringUTF16.hashCode(value);
    }
    return h;
}
```

## 泛型(Generic)重写`equals()`的问题

图`ConcreteEdgeGraph<L>`的内部实现有一个`Edge<L>`类，我在重写`equals`遇到了问题。

```java
// if two edges have same source and target, they are equal
@Override public boolean equals(Object otherObject) {
	// a quick test to see if the objects are identical
    if(this == otherObject) return true;
    
    // must return false if the explicit parameter is null
    if(otherObject == null) return false;
    
    // If the class don't match, they can't be equal
    if(getClass() != otherObject.getClass()) return false;
    
    // now we know otherObject is a non-null Edge<L>
    Edge<L> other = (Edge<L>) otherObject;
    
    // test whether the fields have identical values
    return source.equals(other.source) && target.equals(other.target);
}
```
这段代码中，在
```java
// now we know otherObject is a non-null Edge<L>
Edge<L> other = (Edge<L>) otherObject;
```
处，Eclipse报出静态警告:*Type safety: Unchecked cast from Object to Edge<L>*
意即类型转换没有进行检查，Java不知道这种转换是否安全。
虽然之前已经用`getClass()`确定了`otherObject`就是`Edge`的实例，但`getClass()`函数返回的是**擦除**后的类，也就是说`Edge<String>`和`Edge<Object>`返回的是同一个类`Edge`。
[Stackoverflow](https://stackoverflow.com/questions/2592642/type-safety-unchecked-cast-from-object)[4]上给出了建议的做法，这也是Eclipse提供的Quick fix：
{% blockquote %}
Yes - this is a natural consequence of type erasure. If o is actually an instance of Action<String> that won't be caught by the cast - you'll only see the problem when you try to use it, passing in a ClientInterface instead of a string.            
You can get rid of the warning using:
{% endblockquote %}```java
@SuppressWarnings("unchecked")
```
{% blockquote %}as a function annotation, but you can't easily sort out the underlying problem :（
{% endblockquote %}
当自己知道这样做是安全的的时候，可以选择镇压(suppress)警告。

那么有没有更好的解决办法呢？Java为何警告，我们究竟如何检查这样的类型转换转换是否安全？

## Raw Types[1]

原始(raw)类型是指不带类型参数的泛型类或接口。比如有一个泛型类`Box<T>`：
```java
public class Box<T> {
    public void set(T t) { /* ... */ }
    // ...
}
```
你可以创建参数化(parameterized)类型`Box<T>`：
```java
Box<Integer> intBox = new Box<>();
```
而原始类型则是这样的：
```java
Box rawBox = new Box();
```
在JDK5.0之前，很多类(比如`Collections`)不是泛型，因此原始类型在其中很常见。使用`Box`会将泛型进行*擦除*，也就是把`Box<T>`实现中的`T`全部替换为`Object`，从而产生一个新的类。为了向后兼容，Java允许参数化类型赋值给原始类型：
```java
Box<String> stringBox = new Box<>();
Box rawBox = stringBox;               // OK
```
但是不允许原始类型赋值给参数化类型、一种参数化类型赋值给另一种参数化类型：
```java
Box<Object> objectBox = new Box<>();
objectBox = rawBox;     // Type safety: The expression of type Box needs unchecked conversion to conform to Box<Object>
objectBox = stringBox; // Type mismatch: cannot convert from Box<String> to Box<Object>
```
再将上面代码加入一个类型转换：
```java
objectBox = (Box<Object>)rawBox;     
```
这就出现了与之前一样的警告：*Type safety: Unchecked cast from Box to Box<Object\>*，这是因为你尝试将原始类型转换为参数化类型时，或是一种参数化类型转换为另一种参数化类型。

查了许多资料，最终了解到这是因为这种转换过程不安全，因为编译器无法肯定`rawBox`就是`Box<Object>`而不是`Box<Integer>`、`Box<Double>`等等，改用通配符就可以解决这个问题：
```java
Box<?> otherBox = (Box<?>)rawBox;     
```
这样的话，在使用`getClass()`判断之后确定了`rawBox`是类`Box`的实例，将其downcast(向下转换，即超类转为子类)为`Box<?>`是绝对安全的。

回到自己遇到的的问题上来，`equals()`函数只需要将`Object`转换为`Edge<?>`即可使用其中的`source`等来比较是否相等，不需要具体到`Edge<L>`，因此可以修改为通配符形式：
```java
Edge<?> other = (Edge<?>) otherObject;
```

## 参考资料

1. [Raw Types](https://docs.oracle.com/javase/tutorial/java/generics/rawTypes.html)
2. [Java Generics Type Casting](http://www.javarticles.com/2014/12/type-casting.html)
3. [How do I address unchecked cast warnings?
](https://stackoverflow.com/questions/509076/how-do-i-address-unchecked-cast-warnings?noredirect=1&lq=1)
4. [Type safety: Unchecked cast from Object
](https://stackoverflow.com/questions/2592642/type-safety-unchecked-cast-from-object/49493350#49493350)
5. [Wildcards in Java](https://www.geeksforgeeks.org/wildcards-in-java/)
