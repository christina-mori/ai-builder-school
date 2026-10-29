# AI Builder School · 创造之旅

面向 AI Builder School 学员的前端交互原型。温暖的像素冒险界面，围绕「看任务 → 找锦囊 → 提交作品 → 收反馈 → 修改」展开。

## 本地运行

需要 Python 3，不需要安装前端依赖：

```sh
python3 -m http.server 4173 --bind 127.0.0.1 --directory dist
```

打开 http://127.0.0.1:4173/ 。修改文件后刷新浏览器。

## 页面与功能

- 冒险大厅：向导提示、本周任务日志及提交入口
- 八周旅程：课程方向预览
- 锦囊小屋：任务指导、提示词
- 作品广场：示例作品与反馈
- 认识伙伴：示例档案与搜索
- 我的背包：个人介绍、作品与版本记录

这是前端原型：全部学员与作品为示例；提交、草稿、反馈存于当前浏览器 localStorage，不会同步给其他人。没有后端、登录或正式权限管理。课程安排及验收标准仍需课程组确认。

## 文件结构

- `dist/index.html`：入口
- `dist/app.js`：示例数据、页面渲染与本地交互
- `dist/style.css`：基础布局
- `dist/adventure.css`：冒险主题与字体
- `dist/assets/`：场景和本地字体
- `image-prompt.txt`：场景生成提示词与设计参考

## 协作

从 `main` 新建功能分支，通过 Pull Request 合并。说明改动目的、影响页面、验证步骤；视觉修改附桌面与手机截图。

检查 JavaScript 语法：`node --check dist/app.js`。
提交前实际验证任务弹窗、提交/修改版、导航和手机布局。请勿提交真实学员资料、登录凭据、飞书聊天记录或环境文件。

## 字体与美术

- 标题/导航：[Fusion Pixel 缝合像素](https://github.com/TakWolf/fusion-pixel-font)，OFL 1.1。
- 正文：[LXGW WenKai Lite 霞鹜文楷轻便版](https://github.com/lxgw/LxgwWenKai-Lite)，OFL 1.1。
- 字体及上游许可保存在 `dist/assets/fonts/`，无需第三方字体 CDN。
- 公会场景由图像生成工具制作；像素图标与界面由代码绘制。未使用《星露谷物语》的游戏素材。

仓库公开用于课程平台协作；字体受各自许可证约束，项目代码暂未额外指定开源许可证。

## 地图与进阶锦囊

`dist/learning.js` 扩展知识目录与进阶锦囊，支持领域与难度分别筛选。`dist/journey.js` 和 `dist/journey.css` 为两版共享的首页、向导和地图界面。地图的八个节点切换旁侧任务面板；小屏幕面板排列到地图下方，地图无需横向滚动。

进阶示例「知识库问答为什么答错？」包含 RAG 排错流程、三种本地规则演示、复现实验和验收清单。未接入模型、检索服务或计费 API。分类与示例内容是待课程组审核的建议，不代表已批准的教学安排。

研究参考：
- https://www.anthropic.com/research/contextual-retrieval
- https://docs.dify.ai/en/cloud/use-dify/knowledge/create-knowledge/setting-indexing-methods
- https://www.anthropic.com/research/building-effective-agents

参考用户提供的像素片场源码中的帧式人物起伏、悬停反馈和 reduced-motion 思路，以 CSS/SVG 独立实现。没有复制该网站的人物素材、个人资料、视频或 Three.js 源码。

## 两版风格评审

- A「暖色冒险」：`/index.html`，暖色公会场景与村庄向导。
- B「白昼远征」：`/bright/index.html`，白石山谷、星门徽记与蓝斗篷向导。
- 顶部可互相切换。两版在同一域名共用本地演示存档；不是两套真实账号。
- B 的主体文件是 A 的快照，额外由 `bright.css` 和 `bright.js` 覆盖视觉，确定风格后再合并维护，暂不独立演进业务功能。
- 两版共用一张原创像素世界地图，分别配暖色、蓝白色任务面板。


## 2026-10-29 · 向导与旅程改版

- 向导与气泡移到主图上方，主图下部保留任务日志；两版都有四条可点击切换的提示及对应行动入口。
- 角色为生成的透明图片，轻微起伏与点击回应用 CSS 完成；不是完整逐帧角色动画，也没有创建 ChatGPT 宠物。
- 地图的用途是定位当前周、继续行动、回看作品。八个路标能看到目标、预计产出与当前可用入口。
- W1 显示浏览器里实际保存的草稿、版本和反馈；W2–W8 保留方向预告，不假设已通关、已解锁或已有正式课程。
- 动效支持暂停与系统减少动态效果偏好。手机显示完整地图与下方任务面板。
- 角色工坊留待下一阶段：先做默认外观选择；再确定学员投稿格式、署名、审核与采纳规则。当前没有伪装成可用功能的皮肤市场。
- 原创图像与生成提示记录于 `art-direction-20261029.md`；资产在 `dist/assets/blue-guide.png`、`warm-guide.png`、`journey-world.png`。

验证：两版桌面与 390px 手机布局、8 个地图节点切换、返回当前周、暂停动效、向导提示与锦囊跳转、已有作品记录、无图片加载失败和浏览器错误。后端与多用户同步仍未实现。
