package com.zust.se.service;

import com.zust.se.common.PageResult;
import com.zust.se.model.Favorite;

public interface FavoriteService {

    /** 收藏游记 */
    int favorite(Integer userId, Integer postId);

    /** 取消收藏 */
    int unfavorite(Integer userId, Integer postId);

    /** 检查是否已收藏 */
    boolean isFavorited(Integer userId, Integer postId);

    /** 我的收藏列表（分页，联查游记信息） */
    PageResult<Favorite> listByUserId(Integer userId, int page, int size);
}
