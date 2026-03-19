# 回响圆桌 — Echo Roundtable

> 复盘即是对过去决策的回响，通过分享让经验产生二次共鸣。

游戏策划团队的**专题式案例分享与结构化复盘平台**。每两周一期，围绕特定设计专题，策划们按标准化六段式模板分享实际项目案例与自我复盘，沉淀为可浏览、可搜索、可互动的知识库。

---

## 快速开始

### 启动服务

```bash
cd D:\roundtable
python -m http.server 8889 --bind 0.0.0.0
```

### 访问

- 本机：http://localhost:8889/roundtable.html
- 局域网：`http://<本机IP>:8889/roundtable.html`

密码：`guestpw4mechanism`（与机制库共用）

> 首次访问需输入花名，后续自动记住。

### 后台运行（PowerShell）

```powershell
Start-Process python -ArgumentList "-m http.server 8889 --bind 0.0.0.0" -WorkingDirectory "D:\roundtable" -WindowStyle Hidden
```

---

## 与机制库的关系

回响圆桌是独立项目，与 mechanism-lib-web (`D:\mechanism-lib-web`) 通过互链集成：

- **机制库首页** → 导航栏有 "🔥 回响圆桌" 按钮，跳转到本项目
- **回响圆桌** → 导航栏有 "← 返回机制库" 链接，跳回机制库

两个项目各自独立启动：

| 项目 | 端口 | 启动目录 |
|------|------|----------|
| 机制库 | 8888 | `D:\mechanism-lib-web` |
| 回响圆桌 | 8889 | `D:\roundtable` |

> 同时启动两个服务后，导航栏链接可双向跳转。

---

## 文件说明

| 文件 | 用途 |
|------|------|
| `roundtable.html` | 页面结构（密码门、花名输入、导航栏、内容区、模态框） |
| `roundtable.css` | 全部样式（黑橙技术风，复用机制库设计语言） |
| `roundtable.js` | 全部逻辑（路由、搜索、渲染、互动、个人档案） |
| `roundtable-data.json` | 专题与案例数据（手动维护） |
| `README.md` | 本文件 |

---

## 数据维护

### 数据结构

`roundtable-data.json` 包含两个顶层数组：

```jsonc
{
  "topics": [
    {
      "id": "topic-001",                // 唯一标识
      "title": "肉鸽玩法融合的成与败",    // 专题标题
      "description": "本期圆桌聚焦...",   // 专题介绍（2-4句）
      "discussionSummary": "经过讨论...", // 讨论纪要（可为空）
      "publishDate": "2026-03-01",      // 发布日期
      "tags": ["肉鸽", "玩法融合"]       // 标签
    }
  ],
  "cases": [
    {
      "id": "case-001",                 // 唯一标识
      "topicId": "topic-001",           // 所属专题 ID
      "author": "浮光",                  // 作者花名
      "title": "《哈迪斯》肉鸽+动作...", // 案例标题
      "gameName": "Hades",              // 游戏名
      "tags": ["肉鸽", "动作"],          // 标签
      "sections": {                      // 六段式内容
        "designPurpose": "...",          // 设计目的/出发点
        "implementation": "...",         // 实现手段
        "output": "...",                 // 产出概况
        "obstacles": "...",              // 阻碍难点
        "actualEffect": "...",           // 实际效果
        "lessonsLearned": "..."          // 经验总结
      }
    }
  ]
}
```

### 新增一期圆桌

1. 在 `topics` 数组中添加新专题对象（id 递增，如 `topic-003`）
2. 在 `cases` 数组中添加该专题下的案例（`topicId` 指向新专题 id）
3. 刷新浏览器即可看到新内容，无需重启服务

### 六段式案例模板

每个案例的 `sections` 对应以下六段：

| 字段 | 标题 | 内容要求 |
|------|------|----------|
| `designPurpose` | 🎯 设计目的/出发点 | 要解决什么问题 |
| `implementation` | 🔧 实现手段 | 机制如何与游戏生态融合 |
| `output` | 📦 产出概况 | 投入成本量级、玩法性质等 |
| `obstacles` | ⚠️ 阻碍难点 | 过程中的阻碍和难点 |
| `actualEffect` | 📊 实际效果 | 用户反馈、数据表现（代币回收、在线时长等） |
| `lessonsLearned` | 💡 经验总结 | 成败分析、反思、可参考经验 |

---

## 功能概览

### 首页
- 统计概览（专题数、案例数、参与者数）
- 关键词搜索（空格分隔，AND 匹配，覆盖标题/作者/游戏/标签/内容）
- 标签筛选（从所有案例提取，OR 逻辑，可与搜索叠加）
- 专题卡片（按发布日期倒序）

### 专题详情
- 专题头部（标题、介绍、日期、案例数、标签）
- 案例卡片（3 列网格，含点赞/收藏按钮）
- 讨论纪要

### 案例展示
- 六段式标准化展示（模态框）
- 元信息（作者、游戏、所属专题，均可点击跳转）
- 点赞 / 收藏互动
- 评论区占位（后续版本）

### 个人档案
- 花名 + 头像（首字母）
- 统计（投稿数、参与期数、收藏数）
- 我的投稿 / 我的收藏
- 修改花名

### 其他
- Hash 路由（`#topic=id`、`#case=id`、`#profile`，支持深度链接和浏览器前进/后退）
- 密码保护（与机制库共用 `mechanism_lib_logged_in`）
- 互动数据存储在浏览器 localStorage（后续版本迁移至服务端）

---

## 设计语言

复用机制库的黑橙技术风：

```css
--primary: #FF6600        /* 橙色强调 */
--primary-light: #FF8533  /* 悬停态 */
--bg: #1A1A2E             /* 深蓝黑背景 */
--card-bg: #25253E        /* 卡片背景 */
--text: #F0F0F0           /* 主文字 */
--text-secondary: #A0A0B8 /* 次要文字 */
--border: #3A3A55         /* 边框 */
```

字体：系统字体栈 `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`

---

## 版本记录

### V1.0 — 2026.03.19

首个可用版本，聚焦**内容展示**。

**包含功能：**
- 专题列表首页：Hero 区域 + 统计 + 搜索框 + 标签筛选 + 专题卡片网格
- 专题详情页：专题介绍 + 案例卡片（3 列）+ 讨论纪要
- 案例六段式展示：模态框展示完整案例内容（设计目的 → 经验总结）
- 搜索与筛选：关键词 AND 搜索 + 标签 OR 筛选 + 300ms 防抖
- 个人档案：花名、投稿统计、我的投稿、我的收藏、修改花名
- 点赞 / 收藏：UI 完整，数据存 localStorage
- 评论占位：界面提示"评论功能即将上线"
- Hash 路由：`#topic=`、`#case=`、`#profile` 深度链接
- 密码门 + 花名输入：首次访问两步认证流程
- 机制库互链：双向导航链接

**示例数据：**

| 专题 | 案例数 |
|------|--------|
| 肉鸽玩法融合的成与败 | 3（Hades / Slay the Spire / Dead Cells） |
| 社交系统设计的得与失 | 3（Animal Crossing / Genshin Impact / Among Us） |

5 位示例作者：浮光、策划老王、游戏匠人、系统策划小李、关卡设计师阿花

**未包含（后续版本）：**
- 在线案例投稿 / 提交表单
- 后台管理系统
- 数据统计看板
- 评论功能（仅占位）
- 服务端数据持久化（点赞/收藏/评论）
- 移动端适配

**技术栈：**
- 纯 HTML + CSS + JavaScript（无框架、无构建工具、无外部依赖）
- 数据：静态 JSON 文件，手动维护
- 部署：`python -m http.server`，内网访问
- 互动存储：浏览器 localStorage
