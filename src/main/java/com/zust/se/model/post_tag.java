package com.zust.se.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor

//游记-标签关联表
public class post_tag {
    private Integer post_id;
    private Integer tag_id;
}
