package com.zust.se.mapper;

import com.zust.se.model.Post;
import com.zust.se.model.Tag;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface TagMapper {

    @Select("SELECT * FROM t_tag ORDER BY id ASC")
    List<Tag> findAll();

    @Select("SELECT * FROM t_tag WHERE id = #{id}")
    Tag findById(Integer id);

    @Insert("INSERT INTO t_tag(name) VALUES(#{name})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(Tag tag);

    @Update("UPDATE t_tag SET name = #{name} WHERE id = #{id}")
    int update(Tag tag);

    @Delete("DELETE FROM t_tag WHERE id = #{id}")
    int deleteById(Integer id);
}