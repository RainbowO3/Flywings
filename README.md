# Flywings Scripts

酒馆助手 (TavernHelper) 脚本集。

## Smartphone

- `smartphone.js` — 源码
- `smartphone-import.json` — 酒馆助手导入文件

### 导入方式

**方式一：文件导入**

酒馆助手 → 导入脚本 → 选择 `smartphone-import.json`

**方式二：URL 导入（推荐，可自动更新）**

酒馆助手 → 新建脚本，内容写一行：

```js
import 'https://cdn.jsdelivr.net/gh/RainbowO3/Flywings@main/smartphone.js'
```

或 gcore CDN：

```js
import 'https://gcore.jsdelivr.net/gh/RainbowO3/Flywings@main/smartphone.js'
```

> 注意：`import` 必须用 CDN（jsdelivr/gcore），`raw.githubusercontent.com` 的 MIME 类型会导致浏览器拦截。
