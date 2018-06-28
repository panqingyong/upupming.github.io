---
title: Abstraction Functions and Rep Invariants
tags:
  - java
  - software construction
categories:
  - 编程语言
  - Java
date: 2018-06-23 00:57:03
---

This is an easy-to-understand note for [Reading 13: Abstraction Functions & Rep Invariants][mit-13].

<!-- more -->

# Invariants [ɪn'veərɪənt] 不变量 

*Invariant*: A property of a program that is always true, for every possible runtime state of the program.

Most important property of a good abstract data type is that it *preserves its own invariants*. That means the ADT is responsible for ensuring that its own invariants hold, instead of depending on good behavior from its clients.

Such as: 

+ Immutability

假想一种对客户有要求的String:   
Contrast that with a string type that guarantees that it will be immutable only if its clients promise not to change it. Then you’d have to check all the places in the code where the string might be used.


## Immutability [i,mjuitə'biləti] 不变性

**representation exposure**: Code outside the class can modify the representation directly. It may threaten *invariants* and *representation independence*.

[**representation independence**][mit-12-rep-ind]: The use of an abstract type is independent of its *representation*.

**representation(rep)**: The actual data structure or data fields used to implement the class. 

# Rep invariants and abstraction function

Consider the relationship between two spaces of values:
1. The space of *representation values* consists of the values of the actual implementation as a single object.  
2. The space of *abstract values* consists of the values that the type is designed to support.  

Commonly, a small network of objects is needed to implement the *abstract values*.

<figure class=not-code>
<img src=http://web.mit.edu/6.031/www/sp17/classes/13-abstraction-functions-rep-invariants/figures/charset-af-ri.svg >
<figcaption>Two value spaces' releationship</figcaption>
</figure>

Note:
+ Every abstract value *is mapped to by*(由……映射而来) some rep value.
+ Some abstract values are mapped to by more than one rep value. There's more than one way to represent an abstract value.
+ Not all rep values are mapped. Some reps may have no meaning.

**Abstract Function**
    
**<center>AF : R → A</center>**

The function is surjective/onto(满射的), not necessary injective/one-to-one(单射的), and therefore not necessarily bijective(双射的), and often partial.

**Rep Invariant that maps Rep values to Booleans**

**<center>RI : R → boolean</center>**

For a rep value, RI(r) is true if and only if r is mapped by AF, aks, the rep is well-formed/meaningful.  
RI is the subset of rep values on which AF is defined.

RI(“”) = true, RI(“abc”) = true, and RI(“bac”) = true, but RI(“abbc”) = false.

Note: *rep invariant* is different from *invariant*.

Even with the same type for the rep value space and the same rep invariant, we might still interpret the rep differently.
<figure class=not-code>
<img src="http://web.mit.edu/6.031/www/sp17/classes/13-abstraction-functions-rep-invariants/figures/charset-norepeats.svg">
<img src="http://web.mit.edu/6.031/www/sp17/classes/13-abstraction-functions-rep-invariants/figures/charset-sorted.svg">
<img src="http://web.mit.edu/6.031/www/sp17/classes/13-abstraction-functions-rep-invariants/figures/charset-sortedrange.svg">
<figcaption>Other possible AFs</figcaption>
</figure>

In summary, there are five things to remember:
+ The abstract value space for the specification
+ The rep value space for the implementation
+ Deciding which rep values are legal, and the *rep invariant* is a function from rep values to boolean
+ Interpreting reps as abstract values
+ Writing these assumptions in your code

**Checking the rep invariant**

If your implementation asserts the RI at runtime, then you can catch bugs early.



<figure class=not-code><img src=http://web.mit.edu/6.031/www/sp17/classes/13-abstraction-functions-rep-invariants/figures/ratnum-af-ri.png height=300>
<figcaption>Rep invariant of an abstract data type for rational numbers</figcaption>
</figure>

```java
public class RatNum {

    private final int numerator;
    private final int denominator;

    // Rep invariant(RI):
    //   denominator > 0
    //   numerator/denominator is in reduced form(最简形式)

    // Abstraction function(AF):
    //   AF(numerator, denominator) = numerator/denominator

    /** Make a new RatNum == n.
     *  @param n value */
    public RatNum(int n) {
        numerator = n;
        denominator = 1;
        checkRep();
    }

    /** Make a new RatNum == (n / d).
     *  @param n numerator
     *  @param d denominator
     *  @throws ArithmeticException if d == 0 */
    public RatNum(int n, int d) throws ArithmeticException {
        // reduce ratio to lowest terms
        int g = gcd(n, d);
        n = n / g;
        d = d / g;

        // make denominator positive
        if (d < 0) {
            numerator = -n;
            denominator = -d;
        } else {
            numerator = n;
            denominator = d;
        }
        checkRep();
    }
}
```

Here’s a method for RatNum that tests its rep invariant:

```java
// Check that the rep invariant is true
// *** Warning: this does nothing unless you turn on assertion checking
// by passing -enableassertions to Java
private void checkRep() {
    assert denominator > 0;
    assert gcd(Math.abs(numerator), denominator) == 1;
}
```

Observer methods don't normally need to call `checkRep()`, but it's good defensive practice to do so anyway.

Calling `checkRep()` in every method means you'll be more likely to catch rep invariant caused by rep exposure.

**No null values in the rep**

In MIT 6.031, the rep invariant implicitly includes `x != null` for every reference `x` in the rep that has object type. 
`checkRep()` also checks for `x != null`. It may be checked when you check a string's length, etc.

# Beneficent mutation

**Beneficent mutation**: The *abstract value* should never change. But the implementation is free to mutate a rep value as long as it continues to map to the same abstract value.

For example: A `RatNum` type whose rep has weaker rep invariant that doesn't require the numerator and denominator to be stored in lowest terms.   
We can first simplify the rational number when the user calls 'toString()'. We mutate the rep even in an observer method.

# Documenting the AF, RI, and safety from rep exposure

Precise:
+ RI: what makes the field values valid or not.
+ AF: define how the concrete field values are interpreted.

**rep exposure safety argument**: A comment that examines each part of the rep, looks at the code that handles the part of the rep, and presents a reason why the code doesn't expose the rep.

```java
// Immutable type representing a tweet.
public class Tweet {

    private final String author;
    private final String text;
    private final Date timestamp;

    // Rep invariant:
    //   author is a Twitter username (a nonempty string of letters, digits, underscores)
    //   text.length <= 140
    // Abstraction function:
    //   AF(author, text, timestamp) = a tweet posted by author, with content text, 
    //                                 at time timestamp 
    // Safety from rep exposure:
    //   All fields are private;
    //   author and text are Strings, so are guaranteed immutable;
    //   timestamp is a mutable Date, so Tweet() constructor and getTimestamp() 
    //        make defensive copies to avoid sharing the rep's Date object with clients.

    // Operations (specs and method bodies omitted to save space)
    public Tweet(String author, String text, Date timestamp) { ... }
    public String getAuthor() { ... }
    public String getText() { ... }
    public Date getTimestamp() { ... }
}
```

## What an ADT specification may talk about

ADT should only talk about things that are visible to the client.

# ADT invariants replace preconditions

ADT encapsulates and enforces properties that we would otherwise have to stipulate in a precondition.

use `SortedSet<Character>  set1` instead of
```java
/** 
 * @param set1 is a sorted set of characters with no repeats
 * @param set2 is likewise
 * @return characters that appear in one set but not the other,
 *  in sorted order with no repeats 
 */
static String exclusiveOr(String set1, String set2);
```

because the elaborate precondition is no better than directly using a good ADT.

# References

1. [Reading 13: Abstraction Functions & Rep Invariants][mit-13]

[mit-13]: http://web.mit.edu/6.031/www/sp17/classes/13-abstraction-functions-rep-invariants/#reading_13_abstraction_functions_rep_invariants
[mit-12-rep-ind]: http://web.mit.edu/6.031/www/sp17/classes/12-abstract-data-types/#representation_independence
