package com.zust.se.mapper;

import com.zust.se.model.Post;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface TagMapper {

    //=======根据标签查询=======
    @Select("SELECT * FROM t_tag a, t_post b, t_post_tag c WHERE a.name = #{tag} " +
            "AND a.id = c.tag_id AND b.id = c.post_id")
    List<Post> findPostByTag(String tag);
}
