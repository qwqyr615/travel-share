package com.zust.se.mapper;

import com.zust.se.model.Favorite;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface FavoriteMapper {

    //收藏
    @Insert("INSERT INTO t_favorite(user_id, post_id, created_at) VALUES(#{userId}, #{postId}, #{createdAt})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(Favorite favorite);

    //取消收藏
    @Delete("DELETE FROM t_favorite WHERE user_id = #{userId} AND post_id = #{postId}")
    int delete(@Param("userId") Integer userId, @Param("postId") Integer postId);

    //检查是否已收藏
    @Select("SELECT COUNT(*) FROM t_favorite WHERE user_id = #{userId} AND post_id = #{postId}")
    int exists(@Param("userId") Integer userId, @Param("postId") Integer postId);

    //查收藏列表（联查游记信息，分页走 XML）
    List<Favorite> findByUserId(@Param("userId") Integer userId,
                                 @Param("offset") int offset,
                                 @Param("size") int size);

    //查收藏总数
    @Select("SELECT COUNT(*) FROM t_favorite WHERE user_id = #{userId}")
    int countByUserId(@Param("userId") Integer userId);
}
