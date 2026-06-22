package com.zust.se.mapper;

import com.zust.se.model.Post;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface TravelPostMapper {
    //查个体
    @Results(id = "postMap", value = {
        @Result(property = "cover_image", column = "cover_image"),
        @Result(property = "user_id", column = "user_id"),
        @Result(property = "destination_id", column = "destination_id"),
        @Result(property = "travel_days", column = "travel_days"),
        @Result(property = "travel_date", column = "travel_date"),
        @Result(property = "view_count", column = "view_count"),
        @Result(property = "created_at", column = "created_at"),
        @Result(property = "updated_at", column = "updated_at")
    })
    @Select("SELECT * FROM t_travel_post WHERE id=#{id}")
    Post findById(Integer id);

    //插入
    @Insert("INSERT INTO t_travel_post(title,summary,content,cover_image,user_id,destination_id,travel_days,travel_date,budget,view_count,status) " +
            "VALUES(#{title},#{summary},#{content},#{cover_image},#{user_id},#{destination_id},#{travel_days},#{travel_date},#{budget},#{view_count},#{status})")
    @Options(useGeneratedKeys = true,keyProperty = "id")
    int insert(Post post);

    //更新
    @Update("UPDATE t_travel_post SET title=#{title},summary=#{summary},content=#{content},cover_image=#{cover_image},user_id=#{user_id}, " +
            "destination_id=#{destination_id},travel_days=#{travel_days},travel_date=#{travel_date},budget=#{budget},view_count=#{view_count},status=#{status} " +
            "WHERE id=#{id}")
    int update(Post post);

    //删除个体
    @Delete("DELETE FROM t_travel_post WHERE id=#{id}")
    Integer deleteById(Integer id);

    @Update("UPDATE t_travel_post SET view_count = view_count + 1 WHERE id = #{id}")
    int incrementViewCount(Integer id);

    //查询我的游记
    @ResultMap("postMap")
    @Select("SELECT * FROM t_travel_post WHERE user_id=#{userId} ORDER BY created_at DESC")
    List<Post> findByUserId(Integer userId);

    //查询游记列表
    List<Post> findByCondition(@Param("keyword")String keyword,
                               @Param("destination_id") Integer destination_id,
                               @Param("tag_id") Integer tag_id,
                               @Param("status") String status,
                               @Param("offset") int offset,
                               @Param("size") int size
    );
    //查总数(分页用)
    int countByCondition(@Param("keyword") String keyword,
                         @Param("destination_id") Integer destination_id,
                         @Param("tag_id") Integer tag_id,
                         @Param("status") String status
    );

    //插入标签
    @Insert("INSERT INTO t_post_tag(post_id, tag_id) VALUES(#{post_id}, #{tag_id})")
    int insertPostTag(@Param("post_id") Integer postId, @Param("tag_id") Integer tagId);
    //删除标签
    @Delete("DELETE FROM t_post_tag WHERE post_id = #{post_id}")
    int deletePostTags(@Param("post_id") Integer postId);

}