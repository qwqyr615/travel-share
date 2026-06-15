package com.zust.se.mapper;

import com.zust.se.model.User;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface UserMapper {

    // ========== 注册 & 登录 ==========
    @Insert("INSERT INTO t_user(username, password, nickname, avatar, intro, type, creat_time) " +
            "VALUES(#{username}, #{password}, #{nickname}, #{avatar}, #{intro}, #{type}, #{creatTime})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(User user);

    @Select("SELECT * FROM t_user WHERE username = #{username}")
    User findByUsername(String username);

    // ========== 用户信息查询 ==========
    @Select("SELECT * FROM t_user WHERE id = #{id}")
    User findById(Integer id);

    // ========== 修改密码（旧密码校验） ==========
    @Update("UPDATE t_user SET password = #{newPassword} WHERE id = #{id} AND password = #{oldPassword}")
    int updatePassword(@Param("id") Integer id,
                       @Param("oldPassword") String oldPassword,
                       @Param("newPassword") String newPassword);

    // ========== 修改个人信息 ==========
    int updateInfo(User user);

    // ========== 管理员 ==========
    List<User> findAll();

    //List<User> findByPage(@Param("offset") int offset, @Param("size") int size);

    @Select("SELECT COUNT(*) FROM t_user")
    int countAll();

    int deleteById(Integer id);
}