package com.zust.se.service;

import com.zust.se.model.User;

import java.util.List;

public interface UserService {

    /**
     * 用户注册
     * @return 1=成功, 0=用户名已存在, -1=参数不合法
     */
    int register(User user);

    /**
     * 登录验证，校验用户名和密码
     * @return 登录成功返回 User，失败返回 null
     */
    User login(String username, String password);

    /**
     * 根据 ID 查询用户
     */
    User findById(Integer id);

    /**
     * 修改密码（需验证旧密码）
     * @return 受影响行数：1=成功, 0=旧密码错误或用户不存在
     */
    int updatePassword(Integer id, String oldPassword, String newPassword);

    /**
     * 更新个人信息（昵称、头像、简介）
     * @return 受影响行数
     */
    int updateInfo(User user);

    /**
     * 管理员：查询所有用户
     */
    List<User> findAll();

    /**
     * 管理员：分页查询用户
     */
    //List<User> findByPage(int page, int size);

    /**
     * 管理员：统计用户总数
     */
    int countAll();

    /**
     * 管理员：根据 ID 删除用户
     */
    int deleteById(Integer id);
}
