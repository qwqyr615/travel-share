package com.zust.se.service;

import com.zust.se.common.PageResult;
import com.zust.se.model.Post;

import java.util.List;

public interface TravelPostService {
    /** 发布游记+关联标签 */
    int add(Post post, List<Integer> tag_ids);

    /** 编辑游记+刷新标签关联 */
    int update(Post post, List<Integer> tag_ids);

    /** 删游记 */
    int delete(Integer id);

    /** 查详情+浏览量+1 */
    Post findById(Integer id);

    /** 分页搜索 */
    PageResult<Post> findByCondition(String keyword,
                                     Integer destination_id,
                                     Integer tag_id,
                                     String status,
                                     int page,
                                     int size);
}
