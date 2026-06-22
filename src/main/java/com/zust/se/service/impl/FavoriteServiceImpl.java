package com.zust.se.service.impl;

import com.zust.se.common.PageResult;
import com.zust.se.mapper.FavoriteMapper;
import com.zust.se.model.Favorite;
import com.zust.se.service.FavoriteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class FavoriteServiceImpl implements FavoriteService {

    @Autowired
    private FavoriteMapper favoriteMapper;

    @Override
    public int favorite(Integer userId, Integer postId) {
        // 防止重复收藏
        if (favoriteMapper.exists(userId, postId) > 0) {
            return 0;
        }
        Favorite favorite = new Favorite();
        favorite.setUserId(userId);
        favorite.setPostId(postId);
        favorite.setCreatedAt(new Date());
        return favoriteMapper.insert(favorite);
    }

    @Override
    public int unfavorite(Integer userId, Integer postId) {
        return favoriteMapper.delete(userId, postId);
    }

    @Override
    public boolean isFavorited(Integer userId, Integer postId) {
        return favoriteMapper.exists(userId, postId) > 0;
    }

    @Override
    public PageResult<Favorite> listByUserId(Integer userId, int page, int size) {
        int offset = (page - 1) * size;
        List<Favorite> list = favoriteMapper.findByUserId(userId, offset, size);
        int total = favoriteMapper.countByUserId(userId);
        return new PageResult<>(total, page, size, list);
    }
}
