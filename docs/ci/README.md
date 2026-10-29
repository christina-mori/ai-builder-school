# 启用自动检查

`check.yml` 是待启用的 GitHub Actions 模板，执行 `python3 scripts/check-project.py`，只需代码读取权限，不部署网站。

本次推送使用的 GitHub OAuth 授权没有 `workflow` scope，不能创建 `.github/workflows/` 文件。因此只交付模板，不声称远端 CI 已启用。

具有相应权限的仓库维护者可在后续独立提交中将模板放到 `.github/workflows/check.yml`，通过 GitHub 网页或具备相应授权的 Git 客户端提交。提交后检查 Actions 页的实际运行结果。不要将个人访问令牌写入仓库。

本地检查无需额外 GitHub 权限：

```sh
python3 scripts/check-project.py
```
