---
title: 什麼是競技程式
description: 題目長什麼樣子、程式怎麼被評測，以及常見的評測結果。
unit: 1
part: 基礎觀念
date: 2026-11-22
---

## 一道題目的組成

競技程式的題目通常包含以下幾個部分：

- **題目敘述**：要解決的問題
- **輸入格式 / 輸出格式**：資料怎麼給、答案要怎麼印
- **限制**：資料範圍、時間限制（例如 1 秒）、記憶體限制（例如 256 MB）
- **範例**：幾組輸入與對應的正確輸出

## 評測系統怎麼運作

你送出的程式會被編譯，接著拿許多組**測試資料**去跑，把輸出和標準答案逐一比對。

| 結果 | 意思 |
| --- | --- |
| AC (Accepted) | 全部測資都正確 |
| WA (Wrong Answer) | 有測資的答案錯了 |
| TLE (Time Limit Exceeded) | 執行超過時間限制 |
| MLE (Memory Limit Exceeded) | 記憶體用量超過限制 |
| RE (Runtime Error) | 執行到一半當掉，例如陣列越界、除以零 |
| CE (Compile Error) | 編譯失敗 |

## 第一支程式

讀入兩個整數，輸出它們的和：

```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    long long a, b;
    cin >> a >> b;
    cout << a + b << '\n';
}
```

> 注意資料範圍：如果 $a, b$ 可能到 $10^{18}$，`int` 就裝不下了，要用 `long long`。
