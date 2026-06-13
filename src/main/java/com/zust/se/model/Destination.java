package com.zust.se.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Destination {
    private Integer id;
    private String name; //图片名字
    private String fanme; //用于生成随机不重复文件名
    private String city;
    private String province;
    private String cover_image; //封面图
    private Date creat_time;
}
