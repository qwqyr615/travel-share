[OPEN] avatar-upload-400

# 现象
- 个人主页上传头像时，前端报错 `Request failed with status code 400`
- 用户说明后端通过 `jetty-run` 启动
- 已知文件能落到本地上传目录，但页面仍报错

# 当前假设
1. Jetty 对 `multipart/form-data` 的解析配置不完整，导致请求体部分成功写入但控制器返回 400。
2. 前端上传请求在 `axios`/代理层被附带了不兼容的请求头或路径，Jetty 实际收到的不是预期格式。
3. 上传接口本身成功，但随后的资料保存请求 `PUT /api/user/info` 返回 400，前端把错误归因成了“上传头像失败”。
4. `jetty-run` 下静态资源目录与运行目录不一致，导致返回 URL 或后续读取用户信息时出现异常。
5. 前端当前报错来自真实 HTTP 400，而不是后端业务包装 `{ code: 400 }`，说明问题更可能发生在 servlet 容器层或 multipart 绑定阶段。

# 调试计划
1. 确认 Jetty 启动方式与上传相关依赖/配置。
2. 对头像上传前后链路做最小化埋点，只记录请求路径、状态码和返回体。
3. 复现一次上传，收集前端和服务端运行证据。
4. 基于证据决定是否需要修改前端，若必须改后端再先征求用户确认。

# 证据分析

| ID | 假设 | 状态 | 证据摘要 |
|----|------|------|----------|
| A | Jetty 的 multipart 解析导致上传接口直接返回 400 | ❌ 否定 | `.dbg/trae-debug-log-avatar-upload-400.ndjson` 中 `/upload/avatar` 返回 `status=200` |
| B | 前端上传请求路径或请求头不兼容 Jetty | ❌ 否定 | 同一日志中请求 `url=/upload/avatar`、`isFormData=true`，且服务端正常返回 |
| C | 真正报错的是后续资料保存接口 | ⏳ 本轮未触发 | 本次流程在上传返回后即被前端拦截，尚未进入 `PUT /user/info` |
| D | 返回值格式与前端读取逻辑不一致 | ✅ 确认 | 日志显示上传成功响应 `responseMessage=/uploads/avatars/...png`，前端却只读取 `res.data.data` |
| E | 问题来自容器层真实 HTTP 400 | ❌ 否定 | 本次关键请求不是 HTTP 400，而是前端误判“上传成功但未返回头像地址” |

# 根因
- 后端 `UploadController` 调用 `Result.success(url)` 时命中了 `success(String message)` 重载，导致上传路径落在 `message` 字段而不是 `data` 字段。
- 前端头像上传逻辑只读取 `res.data.data`，因此把一次成功上传误判为失败。

# 修复策略
1. 仅修改前端上传封装，兼容 `data` 和 `message` 两种返回格式。
2. 保留调试埋点，清空日志后进行 `post-fix` 验证。

# 第二轮证据

| ID | 假设 | 状态 | 证据摘要 |
|----|------|------|----------|
| F | `GET /user/info` 没有返回 `avatar` 字段 | ❌ 否定 | 日志显示 `avatar=/uploads/avatars/b80093c1-3e15-473b-86ba-817c19b84ebc.png` |
| G | 前端拿到了头像地址，但图片资源请求失败 | ✅ 确认 | `avatar.image.error` 多次出现，说明浏览器加载图片失败 |
| H | `/uploads/...png` 返回的是 HTML 页面而不是图片 | ✅ 确认 | 本地请求 `http://localhost:8080/uploads/avatars/...png` 返回 `200`，但 `Content-Type=text/html;charset=utf-8`，内容头部是 `<!DOCTYPE html>` |

# 当前结论
- 前端上传与资料保存已修复。
- 头像无法显示的直接原因不是前端拿不到地址，而是 Jetty 当前对 `/uploads/**` 的访问返回了 HTML 页面，浏览器因此无法解码为图片。
- 这属于后端静态资源映射/视图解析优先级问题，需要调整 Spring MVC 或 Jetty 的资源处理配置。
