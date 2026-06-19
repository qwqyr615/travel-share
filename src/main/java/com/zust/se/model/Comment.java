package com.zust.se.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Comment {
    private Integer id;
    private Integer postId;      // 游记ID
    private Integer userId;      // 评论用户ID
    private String content;      // 评论内容
    private Integer parentId;    // 父评论ID（null=顶级评论）
    private Date createTime;     // 创建时间

    // 联表查询附加字段
    private User user;           // 评论用户信息（昵称、头像）
    private List<Comment> replies; // 子回复列表
}