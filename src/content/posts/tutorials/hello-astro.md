---
title: 範例教學：這個 Blog 怎麼寫文章
description: 示範 Markdown 語法、程式碼區塊、數學公式與目錄，順便當作寫作說明書。
date: 2026-11-17
category: tutorial
tags: [Blog, Markdown]
pinned: true
---

這篇是範例文章，示範這個 blog 支援的語法。寫新文章只要在 `src/content/posts/` 底下新增一個 `.md` 檔即可。

## Frontmatter 欄位

每篇文章最上方用 `---` 包起來的區塊：

| 欄位 | 必填 | 說明 |
| --- | --- | --- |
| `title` | ✅ | 標題 |
| `date` | ✅ | 發布日期，例如 `2026-11-17` |
| `category` | ✅ | `tutorial`（教學）、`travel`（旅遊）、`life`（雜記） |
| `description` | | 摘要，會顯示在列表與搜尋結果 |
| `tags` | | 標籤陣列 |
| `cover` | | 封面圖，用相對路徑，例如 `./cover.jpg` |
| `updated` | | 更新日期 |
| `draft` | | 設為 `true` 就不會發布 |
| `pinned` | | 置頂 |

## 程式碼

支援語法高亮，深色模式會自動切換配色：

```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<long long> dp(n + 1);
    dp[0] = dp[1] = 1;
    for (int i = 2; i <= n; i++) dp[i] = dp[i - 1] + dp[i - 2];
    cout << dp[n] << '\n';
}
```

```python
def fib(n: int) -> int:
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a
```

## 數學公式

行內公式像是 $O(n \log n)$，或是獨立一行：

$$
\sum_{i=1}^{n} i = \frac{n(n+1)}{2}
$$

### 小標題也會出現在目錄

右邊（寬螢幕時）的目錄會跟著閱讀位置高亮。

## 引用與圖片

> 這是一段引用。適合放重點提示或注意事項。

圖片放在文章旁邊，用 `![說明](./image.jpg)` 引用，build 時會自動壓縮。
