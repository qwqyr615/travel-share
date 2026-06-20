package com.zust.se.controller;

import com.zust.se.common.Result;
import com.zust.se.dto.LoginRequest;
import com.zust.se.dto.PasswordRequest;
import com.zust.se.dto.RegisterRequest;
import com.zust.se.model.User;
import com.zust.se.service.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserService userService;

    /** 登录 */
    @PostMapping("/login")
    public Result<User> login(@RequestBody LoginRequest request, HttpSession session) {
        User user = userService.login(request.getLoginName(), request.getPassword());
        if (user == null) {
            return Result.error(401, "用户名或密码错误");
        }
        session.setAttribute("loginUser", user);
        return Result.success(user);
    }

    /** 注册 */
    @PostMapping("/register")
    public Result<?> register(@RequestBody RegisterRequest request) {
        User user = new User();
        user.setUsername(request.getRegName());
        user.setPassword(request.getPassword());
        user.setNickname(request.getNickname());

        int result = userService.register(user);
        if (result == -1) {
            return Result.error(400, "注册信息不合法，请检查输入");
        }
        if (result == 0) {
            return Result.error(400, "用户名已被占用");
        }
        return Result.success("注册成功，请登录");
    }

    /** 获取当前登录用户信息 */
    @GetMapping("/info")
    public Result<User> getUserInfo(HttpSession session) {
        User loginUser = (User) session.getAttribute("loginUser");
        if (loginUser == null) {
            return Result.error(401, "请先登录");
        }
        User user = userService.findById(loginUser.getId());
        return Result.success(user);
    }

    /** 更新个人信息 */
    @PutMapping("/info")
    public Result<?> updateUserInfo(@RequestBody User user, HttpSession session) {
        User loginUser = (User) session.getAttribute("loginUser");
        if (loginUser == null) {
            return Result.error(401, "请先登录");
        }
        user.setId(loginUser.getId());
        int rows = userService.updateInfo(user);
        if (rows == 0) {
            return Result.error(400, "更新失败，请检查输入");
        }
        User updated = userService.findById(loginUser.getId());
        session.setAttribute("loginUser", updated);
        return Result.success("更新成功");
    }

    /** 修改密码 */
    @PutMapping("/password")
    public Result<?> updatePassword(@RequestBody PasswordRequest request, HttpSession session) {
        User loginUser = (User) session.getAttribute("loginUser");
        if (loginUser == null) {
            return Result.error(401, "请先登录");
        }
        int rows = userService.updatePassword(loginUser.getId(), request.getOldPassword(), request.getNewPassword());
        if (rows == 0) {
            return Result.error(400, "密码修改失败，请检查原密码是否正确");
        }
        return Result.success("密码修改成功");
    }
}