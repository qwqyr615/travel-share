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
            return -1;
        }

        String username = user.getUsername().trim();
        if (username.length() < 3 || username.length() > 20) {
            return -1;
        }

        if (user.getPassword().length() < 6 || user.getPassword().length() > 32) {
            return -1;
        }

        User exist = userMapper.findByUsername(username);
        if (exist != null) {
            return 0;
        }

        user.setUsername(username);
        if (isBlank(user.getNickname())) {
            user.setNickname(username);
        }
        if (user.getType() == null) {
            user.setType((byte) 0);
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
            return null;
        }

        if (!password.equals(user.getPassword())) {
            return null;
        }

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
            return 0;
        }

        if (oldPassword.equals(newPassword)) {
            return 0;
        }

        return userMapper.updatePassword(id, oldPassword, newPassword);
    }

    // ==================== 更新个人信息 ====================

    @Override
    public int updateInfo(User user) {
        if (user == null || user.getId() == null || user.getId() <= 0) {
            return 0;
        }

        if (user.getNickname() != null) {
            String nickname = user.getNickname().trim();
            if (nickname.isEmpty()) {
                return 0;
            }
            if (nickname.length() > 30) {
                return 0;
            }
            user.setNickname(nickname);
        }

        if (user.getIntro() != null && user.getIntro().length() > 200) {
            return 0;
        }

        return userMapper.updateInfo(user);
    }

    // ==================== 管理员：用户管理 ====================

    @Override
    public List<User> findAll() {
        return userMapper.findAll();
    }

    @Override
    public List<User> findByPage(int page, int size) {
        if (page < 1) page = 1;
        if (size < 1 || size > 100) size = 10;
        int offset = (page - 1) * size;
        return userMapper.findByPage(offset, size);
    }

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