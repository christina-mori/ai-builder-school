# 素材与许可证

## 字体

- [Fusion Pixel 缝合像素](https://github.com/TakWolf/fusion-pixel-font)：OFL 1.1；许可证及合并字体的上游许可位于 `dist/assets/fonts/`。
- [LXGW WenKai Lite](https://github.com/lxgw/LxgwWenKai-Lite)：OFL 1.1；同目录保留原字体和许可。
- `*-ui.woff2` 是界面使用的子集，原始字体供重建子集使用。蓝色版历史字体副本继续保留，整理时应先核对引用与生成工具，避免破坏回退。

分发字体时保留相应许可证和上游版权声明。项目未为整个仓库补设统一开源许可证。

## 图像与界面

现有场景、地图、向导和导航插图由图像生成工具制作，界面边框、交互与部分图形由代码实现。生成记录可参考仓库已有 `art-direction-20261029.md` 与 `image-prompt.txt`。本仓库没有使用《星露谷物语》的游戏原始素材。

运行素材保存在 `dist/assets/` 和 `dist/bright/assets/`。WebP 是网页使用的副本，PNG 还承担加载回退或作为原始资源，请勿仅因文件较大直接删除。生成图片的使用不代表新增品牌、第三方肖像或商标授权。

## 上传范围

此次交接包含运行代码、字体 / 图片及许可、示例锦囊、资源工具和开发文档。没有复制浏览器 localStorage / IndexedDB、真实学员资料、临时评审截图、凭据或 `.openai` 托管配置。既有 GitHub 历史按原样保留，没有重写。
