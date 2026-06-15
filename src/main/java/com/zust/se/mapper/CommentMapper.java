package com.zust.se.mapper;

import com.zust.se.model.Comment;
import org.apache.ibatis.annotations.*;

import java.util.List;
import java.util.Map;

@Mapper
public interface CommentMapper {

    // ========== 增删 ==========

    @Insert("INSERT INTO t_comment(post_id, user_id, create_time) " +
            "VALUES(#{postId}, #{userId}, #{createTime})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(Comment comment);

    @Delete("DELETE FROM t_comment WHERE id = #{id} AND user_id = #{userId}")
    int deleteByIdAndUser(@Param("id") Integer id,
                          @Param("userId") Integer userId);

    @Delete("DELETE FROM t_comment WHERE id = #{id}")
    int deleteById(Integer id);

    @Delete("DELETE FROM t_comment WHERE post_id = #{postId}")
    int deleteByPostId(Integer postId);

    // ========== 查询 ==========

    @Select("SELECT * FROM t_comment WHERE id = #{id}")
    Comment findById(Integer id);

    @Select("SELECT * FROM t_comment WHERE post_id = #{postId} ORDER BY create_time DESC")
    List<Comment> findByPostId(Integer postId);

    @Select("SELECT COUNT(*) FROM t_comment WHERE post_id = #{postId}")
    int countByPostId(Integer postId);

    @Select("SELECT * FROM t_comment WHERE user_id = #{userId} ORDER BY create_time DESC")
    List<Comment> findByUserId(Integer userId);

    // ========== XML 联查 ==========

    List<Comment> findByPostIdWithUser(Integer postId);

    List<Map<String, Object>> findByUserIdWithPost(Integer userId);

}
