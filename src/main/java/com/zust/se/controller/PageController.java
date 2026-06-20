package com.zust.se.controller;

import com.zust.se.model.User;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

/**
 * 页面路由控制器：所有 GET 请求转发到 React SPA，由前端 React Router 渲染
 */
@Controller
public class PageController {

    // ==================== 首页 ====================

    @RequestMapping({"/", "/index", "/index.html"})
    public String index() {
        return "forward:/static/index.html";
    }

    // ==================== 登录 ====================

    @GetMapping("/login")
    public String loginPage() {
        return "forward:/static/index.html";
    }

    // ==================== 注册 ====================

    @GetMapping("/register")
    public String registerPage() {
        return "forward:/static/index.html";
    }

    // ==================== 退出登录 ====================

    @GetMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate();
        return "redirect:/login";
    }

    // ==================== 个人主页 ====================

    @GetMapping("/profile")
    public String profilePage(HttpSession session) {
        User loginUser = (User) session.getAttribute("loginUser");
        if (loginUser == null) {
            return "redirect:/login?error=" + encode("请先登录");
        }
        return "forward:/static/index.html";
    }

    // ==================== 管理员：目的地管理 ====================

    @GetMapping("/admin/destinations")
    public String adminDestinationsPage(HttpSession session) {
        if (!isAdmin(session)) {
            return "redirect:/login?error=" + encode("需要管理员权限");
        }
        return "forward:/static/index.html";
    }

    // ==================== 管理员：标签管理 ====================

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