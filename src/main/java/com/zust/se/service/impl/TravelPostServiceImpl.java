package com.zust.se.service.impl;

import com.zust.se.common.PageResult;
import com.zust.se.mapper.TravelPostMapper;
import com.zust.se.model.Post;
import com.zust.se.service.TravelPostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class TravelPostServiceImpl implements TravelPostService {

    @Autowired
    private TravelPostMapper travelPostMapper;

    @Override
    public int add(Post post, List<Integer> tag_ids) {
        // 补默认值
        post.setStatus("published");
        post.setView_count(0);
        post.setCreated_at(new Date());
        // 插入游记
        travelPostMapper.insert(post);
        // 关联标签
        if (tag_ids != null && !tag_ids.isEmpty()) {
            for (Integer tag_id : tag_ids) {
                travelPostMapper.insertPostTag(post.getId(), tag_id);
            }
        }
        return post.getId();
    }

    @Override
    public int update(Post post, List<Integer> tag_ids) {
        // 从DB查出旧数据，补全请求体未传的字段
        Post existing = travelPostMapper.findById(post.getId());
        if (existing == null) {
            throw new RuntimeException("游记不存在");
        }
        if (post.getStatus() == null) {
            post.setStatus(existing.getStatus());
        }
        if (post.getView_count() == null) {
            post.setView_count(existing.getView_count());
        }
        if (post.getCreated_at() == null) {
            post.setCreated_at(existing.getCreated_at());
        }
        post.setUpdated_at(new Date());
        // 更新游记
        travelPostMapper.update(post);
        // 刷新标签关联：先删后插
        travelPostMapper.deletePostTags(post.getId());
        if (tag_ids != null && !tag_ids.isEmpty()) {
            for (Integer tag_id : tag_ids) {
                travelPostMapper.insertPostTag(post.getId(), tag_id);
            }
        }
        return post.getId();
    }

    @Override
    public int delete(Integer id) {
        return travelPostMapper.deleteById(id);
    }

    @Override
    public List<Post> findByUserId(Integer userId) {
        return travelPostMapper.findByUserId(userId);
    }

    @Override
    public Post findById(Integer id) {
        Post post = travelPostMapper.findById(id);
        if (post != null) {
            travelPostMapper.incrementViewCount(id);
        }
        return post;
    }

    @Override
    public PageResult<Post> findByCondition(String keyword, Integer destination_id,
                                            Integer tag_id, String status,
                                            int page, int size) {
        int offset = (page - 1) * size;
        List<Post> list = travelPostMapper.findByCondition(keyword, destination_id, tag_id, status, offset, size);
        int total = travelPostMapper.countByCondition(keyword, destination_id, tag_id, status);
        return new PageResult<>(total, page, size, list);
    }
}
