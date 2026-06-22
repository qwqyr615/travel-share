package com.zust.se.common;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PageResult<T> {
    private long total;      // 总条数
    private int page;        // 当前页
    private int size;        // 每页条数
    private List<T> list;    // 数据列表
}
