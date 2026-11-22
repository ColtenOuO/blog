---
title: 前綴和
description: 先花 O(n) 預處理，之後每次區間總和查詢都只要 O(1)。
unit: 3
part: 基礎技巧
date: 2026-11-22
---

## 問題

給一個長度為 $n$ 的陣列 $a$，以及 $q$ 筆詢問，每筆詢問區間 $[l, r]$ 的總和。

直接每次用迴圈加總，總共是 $O(nq)$。當 $n, q$ 都是 $2 \times 10^5$ 時就太慢了。

## 想法

定義前綴和 $p_i = a_1 + a_2 + \cdots + a_i$，並令 $p_0 = 0$。那麼區間和就是

$$
a_l + \cdots + a_r = p_r - p_{l-1}
$$

預處理 $O(n)$，每次詢問 $O(1)$，總共 $O(n + q)$。

## 程式碼

```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    int n, q;
    cin >> n >> q;
    vector<long long> p(n + 1, 0);
    for (int i = 1; i <= n; i++) {
        long long x;
        cin >> x;
        p[i] = p[i - 1] + x;
    }
    while (q--) {
        int l, r;
        cin >> l >> r;
        cout << p[r] - p[l - 1] << '\n';
    }
}
```

## 延伸：二維前綴和

在矩陣上，令 $S_{i,j}$ 為左上角 $(1,1)$ 到 $(i,j)$ 的總和，子矩形和可以用排容原理求出：

$$
\text{sum} = S_{x_2,y_2} - S_{x_1-1,y_2} - S_{x_2,y_1-1} + S_{x_1-1,y_1-1}
$$
