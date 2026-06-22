-- ============================================
-- 🏔️ Travel Share — 数据库建表脚本
-- 数据库: MySQL 8.0+ | 字符集: utf8mb4
-- 基于 Java Model 实体类 + Mapper XML 逆向生成
-- ============================================

CREATE DATABASE IF NOT EXISTS travel
    DEFAULT CHARACTER SET utf8mb4
    DEFAULT COLLATE utf8mb4_unicode_ci;

USE travel;

-- ============================================
-- 1. t_user — 用户表
-- 对应模型: com.zust.se.model.User
-- ============================================
DROP TABLE IF EXISTS t_user;
CREATE TABLE t_user (
    id          INT           PRIMARY KEY AUTO_INCREMENT  COMMENT '用户ID',
    username    VARCHAR(50)   NOT NULL                    COMMENT '登录名（不可更改）',
    password    VARCHAR(100)  NOT NULL                    COMMENT '密码',
    nickname    VARCHAR(50)   DEFAULT NULL                COMMENT '昵称（可更改）',
    avatar      VARCHAR(255)  DEFAULT NULL                COMMENT '头像路径',
    intro       VARCHAR(255)  DEFAULT NULL                COMMENT '自我介绍',
    type        TINYINT       NOT NULL DEFAULT 0          COMMENT '角色: 0=USER, 1=ADMIN',
    creat_time  DATETIME      DEFAULT CURRENT_TIMESTAMP   COMMENT '注册时间',
    UNIQUE KEY uk_user_username (username),
    INDEX idx_user_type (type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';


-- ============================================
-- 2. t_destination — 目的地表
-- 对应模型: com.zust.se.model.Destination
-- ============================================
DROP TABLE IF EXISTS t_destination;
CREATE TABLE t_destination (
    id           INT           PRIMARY KEY AUTO_INCREMENT  COMMENT '目的地ID',
    name         VARCHAR(100)  NOT NULL                    COMMENT '名称（如：丽江古城）',
    fanme        VARCHAR(100)  DEFAULT NULL                COMMENT '别名',
    city         VARCHAR(100)  DEFAULT NULL                COMMENT '城市',
    province     VARCHAR(50)   DEFAULT NULL                COMMENT '省份',
    cover_image  VARCHAR(255)  DEFAULT NULL                COMMENT '封面图路径',
    description  TEXT          DEFAULT NULL                COMMENT '简介描述',
    creat_time   DATETIME      DEFAULT CURRENT_TIMESTAMP   COMMENT '创建时间',
    INDEX idx_dest_city (city),
    INDEX idx_dest_province (province)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='目的地表';


-- ============================================
-- 3. t_tag — 标签表
-- 对应模型: com.zust.se.model.Tag
-- ============================================
DROP TABLE IF EXISTS t_tag;
CREATE TABLE t_tag (
    id    INT          PRIMARY KEY AUTO_INCREMENT  COMMENT '标签ID',
    name  VARCHAR(50)  NOT NULL                    COMMENT '标签名（风景/美食/人文/建筑/徒步/亲子/摄影/穷游）',
    UNIQUE KEY uk_tag_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='标签表';


-- ============================================
-- 4. t_travel_post — 游记表（核心表）
-- 对应模型: com.zust.se.model.Post
-- Mapper 注解 & XML 表名: t_travel_post
-- ============================================
DROP TABLE IF EXISTS t_travel_post;
CREATE TABLE t_travel_post (
    id              INT           PRIMARY KEY AUTO_INCREMENT  COMMENT '游记ID',
    title           VARCHAR(200)  NOT NULL                    COMMENT '标题',
    summary         VARCHAR(500)  DEFAULT NULL                COMMENT '摘要（列表页展示）',
    content         LONGTEXT      NOT NULL                    COMMENT '正文（富文本 HTML）',
    cover_image     VARCHAR(255)  DEFAULT NULL                COMMENT '封面图路径',
    user_id         INT           NOT NULL                    COMMENT '作者ID',
    destination_id  INT           DEFAULT NULL                COMMENT '关联目的地ID',
    travel_days     INT           DEFAULT NULL                COMMENT '旅行天数',
    travel_date     DATE          DEFAULT NULL                COMMENT '出发日期',
    budget          DECIMAL(10,2) DEFAULT NULL                COMMENT '预算金额',
    view_count      INT           NOT NULL DEFAULT 0          COMMENT '浏览量',
    status          VARCHAR(20)   NOT NULL DEFAULT 'published' COMMENT '状态: published / draft',
    created_at      DATETIME      DEFAULT CURRENT_TIMESTAMP   COMMENT '创建时间',
    updated_at      DATETIME      DEFAULT CURRENT_TIMESTAMP
                                  ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_post_user (user_id),
    INDEX idx_post_dest (destination_id),
    INDEX idx_post_status (status),
    INDEX idx_post_created (created_at),
    CONSTRAINT fk_post_user FOREIGN KEY (user_id) REFERENCES t_user(id) ON DELETE CASCADE,
    CONSTRAINT fk_post_dest FOREIGN KEY (destination_id) REFERENCES t_destination(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='游记核心表';


-- ============================================
-- 5. t_comment — 评论表（支持嵌套回复）
-- 对应模型: com.zust.se.model.Comment
-- ============================================
DROP TABLE IF EXISTS t_comment;
CREATE TABLE t_comment (
    id          INT           PRIMARY KEY AUTO_INCREMENT  COMMENT '评论ID',
    post_id     INT           NOT NULL                    COMMENT '游记ID',
    user_id     INT           NOT NULL                    COMMENT '评论用户ID',
    content     TEXT          NOT NULL                    COMMENT '评论内容',
    parent_id   INT           DEFAULT NULL                COMMENT '父评论ID（null=顶级评论）',
    create_time DATETIME      DEFAULT CURRENT_TIMESTAMP   COMMENT '创建时间',
    INDEX idx_comment_post (post_id),
    INDEX idx_comment_user (user_id),
    INDEX idx_comment_parent (parent_id),
    CONSTRAINT fk_comment_post FOREIGN KEY (post_id) REFERENCES t_travel_post(id) ON DELETE CASCADE,
    CONSTRAINT fk_comment_user FOREIGN KEY (user_id) REFERENCES t_user(id) ON DELETE CASCADE,
    CONSTRAINT fk_comment_parent FOREIGN KEY (parent_id) REFERENCES t_comment(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='评论表（支持嵌套回复）';


-- ============================================
-- 6. t_post_tag — 游记-标签关联表
-- 对应模型: com.zust.se.model.Post_tag
-- ============================================
DROP TABLE IF EXISTS t_post_tag;
CREATE TABLE t_post_tag (
    post_id INT NOT NULL  COMMENT '游记ID',
    tag_id  INT NOT NULL  COMMENT '标签ID',
    PRIMARY KEY (post_id, tag_id),
    INDEX idx_pt_tag (tag_id),
    CONSTRAINT fk_pt_post FOREIGN KEY (post_id) REFERENCES t_travel_post(id) ON DELETE CASCADE,
    CONSTRAINT fk_pt_tag  FOREIGN KEY (tag_id)  REFERENCES t_tag(id)        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='游记-标签关联表';


-- ============================================
-- 7. t_favorite — 收藏表
-- 对应模型: com.zust.se.model.Favorite
-- ============================================
DROP TABLE IF EXISTS t_favorite;
CREATE TABLE t_favorite (
    id         INT      PRIMARY KEY AUTO_INCREMENT  COMMENT '收藏ID',
    user_id    INT      NOT NULL                    COMMENT '用户ID',
    post_id    INT      NOT NULL                    COMMENT '游记ID',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP   COMMENT '收藏时间',
    UNIQUE KEY uk_fav_user_post (user_id, post_id),
    INDEX idx_fav_user (user_id),
    INDEX idx_fav_post (post_id),
    CONSTRAINT fk_fav_user FOREIGN KEY (user_id) REFERENCES t_user(id)          ON DELETE CASCADE,
    CONSTRAINT fk_fav_post FOREIGN KEY (post_id) REFERENCES t_travel_post(id)  ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='收藏表';


-- ============================================
-- 📦 种子数据
-- ============================================

-- 管理员账号（密码: admin123, BCrypt 编码）
INSERT INTO t_user(username, password, nickname, type) VALUES
('admin', '123456', '管理员', 1),
('alice', '123456', '爱旅行的Alice', 0),
('bob',   '123456', '背包客Bob', 0);

-- 目的地
INSERT INTO t_destination(name, city, province, description) VALUES
('丽江古城',       '丽江', '云南', '世界文化遗产，小桥流水人家的纳西古城'),
('杭州西湖',       '杭州', '浙江', '欲把西湖比西子，淡妆浓抹总相宜'),
('桂林山水',       '桂林', '广西', '桂林山水甲天下，漓江风光如画卷'),
('鼓浪屿',         '厦门', '福建', '海上花园，万国建筑博览'),
('故宫博物院',     '北京', '北京', '世界上最大的宫殿建筑群');

-- 标签
INSERT INTO t_tag(name) VALUES
('风景'), ('美食'), ('人文'), ('建筑'), ('徒步'), ('亲子'), ('摄影'), ('穷游');

-- 示例游记
INSERT INTO t_travel_post(title, summary, content, cover_image, user_id, destination_id, travel_days, view_count, status, created_at) VALUES
('丽江古城三日慢游', '在丽江古城里慢慢走，感受纳西族的悠闲生活。',
 '<h2>初到丽江</h2><p>飞机降落在丽江三义机场，高原阳光格外灿烂。推开窗，远处的玉龙雪山在云雾中若隐若现。</p><p>放下行李就出门觅食，四方街附近的腊排骨火锅香气四溢。</p>',
 'https://picsum.photos/seed/lijiang/800/400',
 2, 1, 3, 128, 'published', '2025-08-15 10:30:00'),
('西湖一日游攻略', '一条经典的西湖游览路线，带你领略杭州的美。',
 '<h2>环湖路线</h2><p>断桥残雪→白堤→平湖秋月→苏堤春晓→花港观鱼→雷峰塔。这条路线大约6公里，走走停停需要一整天。</p><p>建议早上从断桥出发，中午在苏堤附近吃饭，下午去雷峰塔看日落。</p>',
 'https://picsum.photos/seed/westlake/800/400',
 3, 2, 1, 256, 'published', '2025-09-20 14:00:00');

-- 游记标签关联
INSERT INTO t_post_tag(post_id, tag_id) VALUES
(1, 1), (1, 3), (1, 7),
(2, 1), (2, 3), (2, 7);

-- 示例评论（嵌套回复）
INSERT INTO t_comment(post_id, user_id, content, parent_id, create_time) VALUES
(1, 3, '丽江真的值得去，推荐住古城里的客栈！', NULL, '2025-08-16 09:00:00'),
(1, 2, '谢谢推荐，我住的那家也很棒 😄', 1, '2025-08-16 10:30:00'),
(1, 1, '照片拍得真好看，用的什么相机？', NULL, '2025-08-17 14:00:00'),
(2, 2, '西湖的日落真的太美了！', NULL, '2025-09-21 08:00:00');

-- 示例收藏
INSERT INTO t_favorite(user_id, post_id, created_at) VALUES
(3, 1, '2025-08-18 12:00:00');
