package com.zust.se.mapper;

import com.zust.se.model.Post;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface TravelPostMapper {
    @Select("SELECT * FROM t_travel_post WHERE id=#{id}")
    Post findById(Integer id);

    @Insert("INSERT INTO t_travel_post(title,summary,content,cover_image,user_id,destination_id,travel_days,travel_date,budget,view_count,status) " +
            "VALUES(#{title},#{summary},#{content},#{cover_image},#{user_id},#{destination_id},#{travel_days},#{travel_date},#{budget},#{view_count},#{status})")
    @Options(useGeneratedKeys = true,keyProperty = "id")
    int insert(Post post);

    @Update("UPDATE t_travel_post SET title=#{title},summary=#{summary},content=#{content},cover_image=#{cover_image},user_id=#{user_id}, " +
            "destination_id=#{destination_id},travel_days=#{travel_days},travel_date=#{travel_date},budget=#{budget},view_count=#{view_count},status=#{status} " +
            "WHERE id=#{id}")
    int update(Post post);

    @Delete("DELETE FROM t_travel_post WHERE id=#{id}")
    Integer deleteById(Integer id);

    @Update("UPDATE t_travel_post SET view_count = view_count + 1 WHERE id = #{id}")
    int incrementViewCount(Integer id);

    List<Post> findByCondition(@Param("keyword")String keyword,
                               @Param("destination_id") Integer destination_id,
                               @Param("tag_id") Integer tag_id,
                               @Param("status") String status,
                               @Param("offset") int offset,
                               @Param("size") int size
    );

    int countByCondition(@Param("keyword") String keyword,
                         @Param("destination_id") Integer destination_id,
                         @Param("tag_id") Integer tag_id,
                         @Param("status") String status
    );
}
