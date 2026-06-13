package com.zust.se.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    private Integer id;
    private String username; //登入名(不可更改)
    private String password;
    private String nickname; //昵称(可更改)
    private String avatar; //存储头像路径
    private String intro; //自我介绍
    private String type; //0/1 0是管理员 1是普通用户
    private Date creat_time; //注册时间
}
