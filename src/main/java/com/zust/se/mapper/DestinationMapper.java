package com.zust.se.mapper;

import com.zust.se.model.Destination;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface DestinationMapper {
    // 查全部
    @Select("SELECT * FROM t_destination ORDER BY creat_time DESC")
    List<Destination> findAll();

    // 查单个
    @Select("SELECT * FROM t_destination WHERE id = #{id}")
    Destination findById(Integer id);

    // 新增（返回自增ID）
    @Insert("INSERT INTO t_destination(name, fanme, city, province, cover_image, description) " +
            "VALUES(#{name}, #{fanme}, #{city}, #{province}, #{coverImage}, #{description})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(Destination destination);

    // 更新
    @Update("UPDATE t_destination SET name=#{name}, fanme=#{fanme}, city=#{city}, " +
            "province=#{province}, cover_image=#{coverImage}, description=#{description} " +
            "WHERE id=#{id}")
    int update(Destination destination);

    // 删除
    @Delete("DELETE FROM t_destination WHERE id = #{id}")
    int deleteById(Integer id);
}

