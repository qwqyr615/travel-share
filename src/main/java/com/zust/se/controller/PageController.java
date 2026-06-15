package com.zust.se.controller;

import com.zust.se.model.User;
import com.zust.se.service.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

/**
 * 页面路由控制器
 * - GET  → 转发到 React SPA，由客户端 React Router 渲染页面
 * - POST → 处理表单提交，重定向时通过 URL query 传递结果信息
 */
@Controller
public class PageController {

    @Autowired
    private UserService userService;

    // ==================== 首页 ====================

    @RequestMapping({"/", "/index", "/index.html"})
    public String index() {
        return "forward:/static/index.html";
    }

    // ==================== 登入 ====================

    /** 登入页面（GET） */
    @GetMapping("/login")
    public String loginPage() {
        return "forward:/static/index.html";
    }

    /** 登入表单提交（POST） */
    @PostMapping("/login")
    public String login(@RequestParam("username") String username,
                        @RequestParam("password") String password,
                        HttpSession session) {

        User user = userService.login(username, password);

        if (user == null) {
            return "redirect:/login?error=" + encode("用户名或密码错误");
        }

        session.setAttribute("User", user);
        return "redirect:/";
    }

    // ==================== 注册 ====================

    /** 注册页面（GET） */
    @GetMapping("/register")
    public String registerPage() {
        return "forward:/static/index.html";
    }

    /** 注册表单提交（POST） */
    @PostMapping("/register")
    public String register(@RequestParam("username") String username,
                           @RequestParam("password") String password,
                           @RequestParam(value = "nickname", required = false) String nickname,
                           @RequestParam(value = "avator", required = false) String avatar,
                           @RequestParam(value = "intro", required = false) String intro) {

        User user = new User();
        user.setUsername(username);
        user.setPassword(password);
        user.setNickname(nickname);
        user.setIntro(intro);


        int result = userService.register(user);

        if (result == -1) {
            return "redirect:/register?error=" + encode("注册信息不合法，请检查输入");
        }
        if (result == 0) {
            return "redirect:/register?error=" + encode("用户名已被占用");
        }

        return "redirect:/login?success=" + encode("注册成功，请登录");
    }

    // ==================== 退出登录 ====================

    @GetMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate();
        return "redirect:/login";
    }

    // ==================== 个人主页 ====================

    /** 个人主页：我的游记 / 收藏 / 信息编辑 */
    @GetMapping("/profile")
    public String profilePage(HttpSession session) {
        User username = (User) session.getAttribute("username");
        if (username == null) {
            return "redirect:/login?error=" + encode("请先登录");
        }
        return "forward:/static/index.html";
    }

    // ==================== 管理员：目的地管理 ====================

    /** 目的地管理：表格 + 增删改 */
    @GetMapping("/admin/destinations")
    public String adminDestinationsPage(HttpSession session) {
        if (!isAdmin(session)) {
            return "redirect:/login?error=" + encode("需要管理员权限");
        }
        return "forward:/static/index.html";
    }

    // ==================== 管理员：标签管理 ====================

    /** 标签管理：列表 + 增删 */
    @GetMapping("/admin/tags")
    public String adminTagsPage(HttpSession session) {
        if (!isAdmin(session)) {
            return "redirect:/login?error=" + encode("需要管理员权限");
        }
        return "forward:/static/index.html";
    }

    // ==================== 管理员：其他管理页通配 ====================

    @GetMapping("/admin/**")
    public String adminCatchAll(HttpSession session) {
        if (!isAdmin(session)) {
            return "redirect:/login?error=" + encode("需要管理员权限");
        }
        return "forward:/static/index.html";
    }

    // ==================== SPA 兜底路由 ====================

    @RequestMapping({
        "/{segment:^(?!api$)(?!static$)[^\\.]+}",
        "/{segment:^(?!api$)(?!static$)[^\\.]+}/**"
    })
    public String forwardSpa() {
        return "forward:/static/index.html";
    }

    // ==================== 工具方法 ====================

    private boolean isAdmin(HttpSession session) {
        User loginUser = (User) session.getAttribute("loginUser");
        return loginUser != null && loginUser.getType() != null && loginUser.getType() == 1;
    }

    private String encode(String value) {
        return URLEncoder.encode(value, StandardCharsets.UTF_8);
    }
}
