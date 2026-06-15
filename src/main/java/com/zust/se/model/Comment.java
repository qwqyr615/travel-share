package com.zust.se.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
//评论表
public class Comment {
    private Integer id;
    private Integer post_id; //游记的id
    private Integer user_id;
    private Date create_time;
}
