package com.zust.se.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class Post {
    private Integer id;
    private String title;
    private String summary;
    private String content;
    private String cover_image;//-----封面图路径
    private List<> images//    private Integer user_id;
    private Integer destination_id;
    private Integer travel_days;
    private Date travel_date;//-----出发日期
    private BigDecimal budget;
    private Integer view_count;
    private String status;
    private Date created_at;
    private Date updated_at;
}
