# Travel-Share API 文档

> 项目版本: v1.0 | 后端基地址: http://localhost:8080 | 响应格式: Result<T>

---

## 一、统一响应格式

所有接口统一返回 Result<T>:

```json
{
  "code": 200,
  "message": "success",
  "data": { ... }
}
```

| code | 含义 |
|------|------|
| 200 | 成功 |
| 400 | 请求参数错误 |
| 401 | 未登录 |
| 403 | 无权限 |
| 404 | 资源不存在 |
| 500 | 服务器错误 |

---

## 二、用户模块 /api/user

### 2.1 登录

```
POST /api/user/login
```

Request Body: { "loginName": "string", "password": "string" }

错误码: 401 - 用户名或密码错误

### 2.2 注册

```
POST /api/user/register
```

Request Body: { "regName": "string", "password": "string", "nickname": "string" }

错误码: 400 - 注册信息不合法 / 用户名已被占用

### 2.3 获取用户信息

```
GET /api/user/info
```

需登录 | 错误码: 401 - 请先登录

### 2.4 更新个人信息

```
PUT /api/user/info
```

Request Body: { "nickname": "新昵称", "avatar": "/uploads/xxx.jpg", "intro": "简介" }

错误码: 401 - 请先登录, 400 - 更新失败

### 2.5 修改密码

```
PUT /api/user/password
```

Request Body: { "oldPassword": "旧密码", "newPassword": "新密码" }

错误码: 401 - 请先登录, 400 - 原密码错误

---

## 三、目的地模块 /api/destinations

```
GET    /api/destinations         # 列表
GET    /api/destinations/options  # 下拉选项
POST   /api/destinations         # 新增
PUT    /api/destinations/{id}     # 编辑
DELETE /api/destinations/{id}     # 删除
```

---

## 四、标签模块 /api/tags

```
GET    /api/tags         # 列表
POST   /api/tags         # 新增
PUT    /api/tags/{id}     # 编辑
DELETE /api/tags/{id}     # 删除
```

---

## 五、评论模块 /api/comment

```
POST   /api/comment/publish             # 发表/回复 (需登录)
GET    /api/comment/list/{postId}        # 评论列表
GET    /api/comment/count/{postId}       # 评论总数
DELETE /api/comment/delete/{commentId}   # 用户删除 (需登录)
DELETE /api/comment/admin/delete/{id}    # 管理员删除
```

---

## 六、文件上传 /api/upload

```
POST /api/upload/cover   # 上传封面图
POST /api/upload/image   # 上传内容图片
POST /api/upload/avatar  # 上传头像
```

参数: file (MultipartFile), 支持 jpg/png/gif/webp, 最大 20MB
返回: /uploads/{subDir}/uuid.jpg

---

## 七、SPA 页面路由 (PageController)

| 路径 | 说明 | 权限 |
|------|------|------|
| / | 首页 | 公开 |
| /login | 登录页 | 公开 |
| /register | 注册页 | 公开 |
| /logout | 退出登录 | 公开 |
| /profile | 个人主页 | 需登录 |
| /admin/destinations | 目的地管理 | 管理员 |
| /admin/tags | 标签管理 | 管理员 |
| /admin/** | 其他管理页 | 管理员 |
| 其他 {segment} | SPA 兜底 | 公开 |

---

## 八、数据库表结构

### t_user
| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT | 主键自增 |
| username | VARCHAR | 登录名 |
| password | VARCHAR | 密码 |
| nickname | VARCHAR | 昵称 |
| avatar | VARCHAR | 头像 URL |
| intro | VARCHAR | 自我介绍 |
| type | TINYINT | 0=用户, 1=管理员 |
| creat_time | DATETIME | 注册时间 |

### t_destination
| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT | 主键自增 |
| name | VARCHAR | 名称 |
| fanme | VARCHAR | 别名 |
| city | VARCHAR | 城市 |
| province | VARCHAR | 省份 |
| cover_image | VARCHAR | 封面图 |
| description | TEXT | 描述 |
| creat_time | DATETIME | 创建时间 |

### t_tag
| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT | 主键自增 |
| name | VARCHAR | 标签名 |

### t_comment
| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT | 主键自增 |
| post_id | INT | 游记 ID |
| user_id | INT | 用户 ID |
| content | TEXT | 内容 |
| parent_id | INT | 父评论 ID |
| create_time | DATETIME | 创建时间 |

---

## 九、项目分层

```
controller/     # 控制层 (接收请求, 返回 Result<T>)
service/        # 业务接口
service/impl/   # 业务实现
mapper/         # MyBatis Mapper (注解 + XML)
model/          # 数据模型 (POJO)
dto/            # 请求体 DTO
common/         # 通用工具 (Result)
```

项目使用 Session 鉴权:

```java
User loginUser = (User) session.getAttribute("loginUser");
if (loginUser == null) return Result.error(401, "请先登录");
// 管理员判断: loginUser.getType() == 1
```


---

## 十、游记模块 `/api/posts`（待开发）

> ⚠️ 以下接口 `TravelPostController` 尚未实现，需要你的伙伴完成后端后再对接。

### 数据模型 Post

```json
{
  "id": 1,
  "title": "杭州三日游",
  "summary": "简要描述",
  "content": "详细内容 HTML",
  "cover_image": "/uploads/covers/xxx.jpg",
  "user_id": 1,
  "destination_id": 1,
  "travel_days": 3,
  "travel_date": "2026-07-01",
  "budget": 2000.00,
  "view_count": 128,
  "status": "published",
  "created_at": "2026-06-19T12:00:00",
  "updated_at": "2026-06-19T12:00:00"
}
```

### 10.1 发布游记（含标签关联）

```
POST /api/posts
```

> 需要登录

**Request Body:**
```json
{
  "title": "杭州三日游",
  "summary": "简要描述",
  "content": "详细内容",
  "cover_image": "/uploads/covers/xxx.jpg",
  "destination_id": 1,
  "travel_days": 3,
  "travel_date": "2026-07-01",
  "budget": 2000.00,
  "tag_ids": [1, 2, 3]
}
```

> `tag_ids` 为标签 ID 数组，后端自动写入 `t_post_tag` 关联表

| 错误码 | 说明 |
|--------|------|
| 401 | 请先登录 |
| 400 | 参数校验失败 |

### 10.2 编辑游记

```
PUT /api/posts/{id}
```

> 需要登录，且只能编辑自己的游记

**Request Body:** 同发布，所有字段可选（只传要改的）

### 10.3 删除游记

```
DELETE /api/posts/{id}
```

> 需要登录，且只能删除自己的游记。管理员可删除任意游记。

| 错误码 | 说明 |
|--------|------|
| 401 | 请先登录 |
| 403 | 无权限删除 |

### 10.4 游记详情

```
GET /api/posts/{id}
```

返回游记详情 + 作者信息 + 标签列表 + 评论数

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1,
    "title": "杭州三日游",
    "summary": "...",
    "content": "...",
    "cover_image": "/uploads/covers/xxx.jpg",
    "user_id": 1,
    "destination_id": 1,
    "travel_days": 3,
    "travel_date": "2026-07-01",
    "budget": 2000.00,
    "view_count": 128,
    "status": "published",
    "created_at": "...",
    "updated_at": "...",
    "author": { "id": 1, "nickname": "张三", "avatar": "..." },
    "tags": [ { "id": 1, "name": "风景" } ],
    "comment_count": 12
  }
}
```

### 10.5 游记列表（分页 + 多条件搜索）

```
GET /api/posts?page=1&size=10&keyword=杭州&destination_id=1&tag_id=2&status=published
```

| 参数 | 类型 | 说明 | 默认 |
|------|------|------|------|
| page | int | 页码 | 1 |
| size | int | 每页条数 | 10 |
| keyword | string | 关键词（标题/摘要模糊搜索） | 可选 |
| destination_id | int | 目的地筛选 | 可选 |
| tag_id | int | 标签筛选 | 可选 |
| status | string | 状态筛选 (published/draft) | 可选 |

**Response:**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [ ... ],
    "total": 42,
    "page": 1,
    "size": 10,
    "pages": 5
  }
}
```

---

## 十一、收藏模块（待开发）

> 需要新建 `t_favorite` 表：`id, user_id, post_id, created_at`  
> 需要新建 `FavoriteMapper`、`FavoriteService`、`FavoriteController`

### 11.1 收藏 / 取消收藏（切换）

```
POST /api/posts/{id}/favorite
```

> 需要登录。已收藏则取消，未收藏则添加。

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "favorited": true,
    "favorite_count": 42
  }
}
```

### 11.2 查询是否已收藏

```
GET /api/posts/{id}/favorite/status
```

> 需要登录

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "favorited": true
  }
}
```

### 11.3 我的收藏列表

```
GET /api/user/favorites?page=1&size=10
```

> 需要登录，返回当前用户收藏的游记列表（分页）

---

## 十二、浏览量统计（已有 Mapper 方法）

### 12.1 增加浏览量

```
POST /api/posts/{id}/view
```

> 无需登录，每次调用 +1

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "view_count": 129
  }
}
```

> ⚠️ 后端 `TravelPostMapper.incrementViewCount()` 已存在，但需新增 `TravelPostController`、`TravelPostService` 对外暴露接口。

---

## 十三、待开发清单

| 功能 | 需要创建的文件 | 优先 |
|------|--------------|------|
| 游记 CRUD | `TravelPostController`, `TravelPostService`, `TravelPostServiceImpl` | 高 |
| 游记标签关联 | 在增/改游记时操作 `t_post_tag` 表 | 高 |
| 游记列表搜索 | Controller 调用 Mapper 的 `findByCondition` / `countByCondition` | 高 |
| 收藏功能 | `t_favorite` 表, `FavoriteMapper`, `FavoriteService`, `FavoriteController` | 中 |
| 浏览量 | `TravelPostService` 调用 `incrementViewCount` | 中 |


---

## 十四、后端 Service 方法调用速查

### 14.1 FileService - 文件上传
```java@Autowired
private FileService fileService;

// 上传封面图 -> /uploads/covers/uuid.jpgString url = fileService.upload(file, "covers");
// 上传内容图 -> /uploads/images/uuid.jpgString url = fileService.upload(file, "images");
// 上传头像 -> /uploads/avatars/uuid.jpgString url = fileService.upload(file, "avatars");`
"@ + '> 参数: file (MultipartFile), subDir (子目录名)' + @"
> 返回: /uploads/{subDir}/{uuid}.{suffix}
> 异常: IOException
### 14.2 UserService - 用户

```java
@Autowired
private UserService userService;

// 登录 - 返回 User(密码已清空) 或 null
User user = userService.login(username, password);

// 注册 - 1=成功, 0=用户名已存在, -1=参数不合法
int result = userService.register(user);

// 查用户
User user = userService.findById(userId);

// 修改密码 - 1=成功, 0=失败
int rows = userService.updatePassword(userId, oldPwd, newPwd);

// 更新个人信息（昵称/头像/简介）
int rows = userService.updateInfo(user);
```

### 14.3 DestinationService - 目的地

```java
@Autowired
private DestinationService destinationService;

List<Destination> list = destinationService.getAll();
Destination d = destinationService.findById(id);
int rows = destinationService.add(destination);
int rows = destinationService.update(destination);
int rows = destinationService.deleteById(id);
```

### 14.4 TagService - 标签

```java
@Autowired
private TagService tagService;

List<Tag> list = tagService.getAll();
Tag tag = tagService.findById(id);
int rows = tagService.add(tag);
int rows = tagService.update(tag);
int rows = tagService.deleteById(id);
```

### 14.5 CommentService - 评论

```java
@Autowired
private CommentService commentService;

// 发表评论（parentId=null顶级评论，有值=回复）
Comment saved = commentService.publish(comment);

// 查评论列表
List<Comment> list = commentService.listByPostId(postId);

// 查评论总数
int count = commentService.countByPostId(postId);

// 用户删除 - 1=成功, 0=无权限或不存在
int rows = commentService.delete(commentId, userId);

// 管理员删除 - 1=成功, 0=不存在
int rows = commentService.deleteByAdmin(commentId);
```

### 14.6 TravelPostMapper - 游记（Mapper已就绪，Service待完善）

```java
@Autowired
private TravelPostMapper postMapper;

// 新增游记
postMapper.insert(post);

// 编辑游记
postMapper.update(post);

// 删除游记
postMapper.deleteById(postId);

// 动态条件分页查询（Mapper XML 已写好）
List<Post> list = postMapper.findByCondition(keyword, destId, tagId, status, offset, size);
int total = postMapper.countByCondition(keyword, destId, tagId, status);

// 增加浏览量
postMapper.incrementViewCount(postId);
```

### 14.7 PostTagMapper - 游记标签关联（待创建）

```java
@Mapper
public interface PostTagMapper {
    @Insert("INSERT INTO t_post_tag(post_id, tag_id) VALUES(#{postId}, #{tagId})")
    int insert(@Param("postId") Integer postId, @Param("tagId") Integer tagId);

    @Delete("DELETE FROM t_post_tag WHERE post_id = #{postId}")
    int deleteByPostId(Integer postId);

    @Select("SELECT tag_id FROM t_post_tag WHERE post_id = #{postId}")
    List<Integer> findTagIdsByPostId(Integer postId);
}
```

### 14.8 FavoriteMapper - 收藏（需新建表 + Mapper）

先建表:

```sql
CREATE TABLE t_favorite (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    post_id INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_user_post (user_id, post_id)
);
```

再建 Mapper:

```java
@Mapper
public interface FavoriteMapper {
    @Insert("INSERT INTO t_favorite(user_id, post_id) VALUES(#{userId}, #{postId})")
    int insert(@Param("userId") Integer userId, @Param("postId") Integer postId);

    @Delete("DELETE FROM t_favorite WHERE user_id = #{userId} AND post_id = #{postId}")
    int delete(@Param("userId") Integer userId, @Param("postId") Integer postId);

    @Select("SELECT COUNT(*) FROM t_favorite WHERE user_id = #{userId} AND post_id = #{postId}")
    int check(@Param("userId") Integer userId, @Param("postId") Integer postId);

    @Select("SELECT COUNT(*) FROM t_favorite WHERE post_id = #{postId}")
    int countByPostId(Integer postId);
}
```
