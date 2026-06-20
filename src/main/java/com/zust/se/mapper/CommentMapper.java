package com.zust.se.mapper;

import com.zust.se.model.Comment;
import org.apache.ibatis.annotations.*;

import java.util.List;
import java.util.Map;

@Mapper
public interface CommentMapper {

    // ========== 增删 ==========

    @Insert("INSERT INTO t_comment(post_id, user_id, content, parent_id, create_time) " +
            "VALUES(#{postId}, #{userId}, #{content}, #{parentId}, #{createTime})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(Comment comment);

    @Delete("DELETE FROM t_comment WHERE id = #{id} AND user_id = #{userId}")
    int deleteByIdAndUser(@Param("id") Integer id,
                          @Param("userId") Integer userId);

    @Delete("DELETE FROM t_comment WHERE id = #{id}")
    int deleteById(Integer id);

    @Delete("DELETE FROM t_comment WHERE post_id = #{postId}")
    int deleteByPostId(Integer postId);

    @Delete("DELETE FROM t_comment WHERE parent_id = #{parentId}")
    int deleteByParentId(Integer parentId);

    // ========== 查询 ==========

    @Select("SELECT * FROM t_comment WHERE id = #{id}")
    Comment findById(Integer id);

    @Select("SELECT * FROM t_comment WHERE post_id = #{postId} ORDER BY create_time DESC")
    List<Comment> findByPostId(Integer postId);

    @Select("SELECT * FROM t_comment WHERE post_id = #{postId} AND parent_id IS NULL ORDER BY create_time DESC")
    List<Comment> findTopLevelByPostId(Integer postId);

    @Select("SELECT * FROM t_comment WHERE parent_id = #{parentId} ORDER BY create_time ASC")
    List<Comment> findRepliesByParentId(Integer parentId);

    @Select("SELECT COUNT(*) FROM t_comment WHERE post_id = #{postId}")
    int countByPostId(Integer postId);

    @Select("SELECT * FROM t_comment WHERE user_id = #{userId} ORDER BY create_time DESC")
    List<Comment> findByUserId(Integer userId);

    // ========== XML 联查 ==========

    List<Comment> findByPostIdWithUser(Integer postId);

    List<Comment> findTopLevelWithUser(Integer postId);

    List<Comment> findRepliesWithUser(Integer parentId);

    List<Map<String, Object>> findByUserIdWithPost(Integer userId);
}