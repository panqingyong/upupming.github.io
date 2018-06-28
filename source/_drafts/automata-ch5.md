---
title: Chapter 5. Context-Free Grammars and Languages Solutions
tags:
---

## Exercise 5.1.1

Design context-free grammars for the following languages:

a) The set $\{0^n1^n\,|\,n \ge 1 \}$, that is, the set of all strings of one or more 0's followed by an equal number of 1's.

$$S \to 0S1 \,|\, 01$$

The grammar $G$ for the language is represented by


$$G = (V, T, P, S) = (\{S\}, \{0, 1\}, A, S)$$

where A represents the set of the production above.

b) The set $\{a^ib^jc^k\, |\, i \ne j\, or\, j \ne k\}$, that is, the set of all strings of one or more 0's followed by an equal number of 1's.


d) The set of all strings with twice as many 0's as 1's.

**Hint**:  

Some legal examples are: $\epsilon$, 001, 010, 100, 000011, 010100, etc.

Every time 0 is added, two 1's should also be added to the string to keep balance.

**Solution**:

$$\begin{align}
S &\to \epsilon\, \\
S &\to 001A\,|\,00A1\,|0A01\,|\,A001 \\ 
S &\to 010A\,|\,01A0\,|0A10\,|\,A010 \\ 
S &\to 100A\,|\,10A0\,|1A00\,|\,A100 \\ 
\end{align}$$

