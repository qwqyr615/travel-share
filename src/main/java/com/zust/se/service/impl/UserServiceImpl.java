package com.zust.se.service.impl;

import com.zust.se.mapper.UserMapper;
import com.zust.se.model.User;
import com.zust.se.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserMapper userMapper;

    // ==================== 注册 ====================

    @Override
    @Transactional
    public int register(User user) {
        if (user == null || isBlank(user.getUsername()) || isBlank(user.getPassword())) {
            return -1; // 参数不合法
        }

        // 用户名长度校验
        String username = user.getUsername().trim();
        if (username.length() < 3 || username.length() > 20) {
            return -1; // 用户名长度 3-20 位
        }

        // 密码长度校验
        if (user.getPassword().length() < 6 || user.getPassword().length() > 32) {
            return -1; // 密码长度 6-32 位
        }

        // 检查用户名是否已存在
        User exist = userMapper.findByUsername(username);
        if (exist != null) {
            return 0; // 用户名已被占用
        }

        // 设置默认值
        user.setUsername(username);
        if (isBlank(user.getNickname())) {
            user.setNickname(username); // 默认昵称=用户名
        }
        if (user.getType() == null) {
            user.setType((byte) 0); // 默认普通用户
        }
        if (user.getCreat_time() == null) {
            user.setCreat_time(new Date());
        }

        return userMapper.insert(user);
    }

    // ==================== 登录验证 ====================

    @Override
    public User login(String username, String password) {
        if (isBlank(username) || isBlank(password)) {
            return null;
        }

        User user = userMapper.findByUsername(username.trim());
        if (user == null) {
            return null; // 用户不存在
        }

        // 密码校验
        if (!password.equals(user.getPassword())) {
            return null; // 密码错误
        }

        // 清除敏感信息后再返回
        user.setPassword(null);
        return user;
    }

    // ==================== 根据 ID 查询 ====================

    @Override
    public User findById(Integer id) {
        if (id == null || id <= 0) {
            return null;
        }
        User user = userMapper.findById(id);
        if (user != null) {
            user.setPassword(null);
        }
        return user;
    }

    // ==================== 修改密码 ====================

    @Override
    public int updatePassword(Integer id, String oldPassword, String newPassword) {
        if (id == null || id <= 0 || isBlank(oldPassword) || isBlank(newPassword)) {
            return 0;
        }

        if (newPassword.length() < 6 || newPassword.length() > 32) {
            return 0; // 新密码长度不合法
        }

        if (oldPassword.equals(newPassword)) {
            return 0; // 新旧密码不能相同
        }

        return userMapper.updatePassword(id, oldPassword, newPassword);
    }

    // ==================== 更新个人信息 ====================

    @Override
    public int updateInfo(User user) {
        if (user == null || user.getId() == null || user.getId() <= 0) {
            return 0;
        }

        // 昵称校验
        if (user.getNickname() != null) {
            String nickname = user.getNickname().trim();
            if (nickname.isEmpty()) {
                return 0;
            }
            if (nickname.length() > 30) {
                return 0; // 昵称最长30字
            }
            user.setNickname(nickname);
        }

        // 简介校验
        if (user.getIntro() != null && user.getIntro().length() > 200) {
            return 0; // 简介最长200字
        }

        return userMapper.updateInfo(user);
    }

    // ==================== 管理员：用户管理 ====================

    @Override
    public List<User> findAll() {
        return userMapper.findAll();
    }

//    @Override
//    public List<User> findByPage(int page, int size) {
//        if (page < 1) page = 1;
//        if (size < 1 || size > 100) size = 10;
//        int offset = (page - 1) * size;
//        return userMapper.findByPage(offset, size);
//    }

    @Override
    public int countAll() {
        return userMapper.countAll();
    }

    @Override
    @Transactional
    public int deleteById(Integer id) {
        if (id == null || id <= 0) {
            return 0;
        }
        return userMapper.deleteById(id);
    }

    // ==================== 工具方法 ====================

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }
}
