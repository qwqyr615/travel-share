package com.zust.se.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Favorite {
    private Integer id;
    private Integer userId;
    private Integer postId;
    private Date createdAt;

    //联查扩展字段（非数据库字段）
    private String postTitle;      // 游记标题
    private String postCoverImage; // 游记封面图
    private String postSummary;    // 游记摘要
}
