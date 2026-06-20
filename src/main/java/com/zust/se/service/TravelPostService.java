package com.zust.se.service;

import com.zust.se.model.Post;

public interface TravelPostService {
    Post findById(Integer id);
    int insert(Post post);
    int update(Post post);
    int deleteById(Post post);

}
