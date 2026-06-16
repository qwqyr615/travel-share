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
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.UUID;

@Controller
public class PageController {

    @Autowired
    private UserService userService;

    // ==================== 主页 ====================

    @RequestMapping({"/", "/index", "/index.html"})
    public String index() {
        return "forward:/static/index.html";
    }

    // ==================== Login ====================

    @GetMapping("/login")
    public String loginPage() {
        return "forward:/static/index.html";
    }

    @PostMapping("/login")
    public String login(@RequestParam("username") String username,
                        @RequestParam("password") String password,
                        HttpSession session) {

        User user = userService.login(username, password);

        if (user == null) {
            return "redirect:/login?error=" + encode("username or password incorrect");
        }

        session.setAttribute("loginUser", user);
        return "redirect:/";
    }

    // ==================== Register ====================

    @GetMapping("/register")
    public String registerPage() {
        return "forward:/static/index.html";
    }

    @PostMapping("/register")
    public String register(@RequestParam("username") String username,
                           @RequestParam("password") String password,
                           @RequestParam(value = "nickname", required = false) String nickname,
                           @RequestParam(value = "avatar", required = false) MultipartFile avatar,
                           @RequestParam(value = "intro", required = false) String intro) {

        String avatarPath = null;
        if (avatar != null && !avatar.isEmpty()) {
            String originalName = avatar.getOriginalFilename();
            String suffix = "";
            if (originalName != null && originalName.contains(".")) {
                suffix = originalName.substring(originalName.lastIndexOf(".")).toLowerCase();
            }
            if (!suffix.matches("\\.(jpg|jpeg|png|gif|webp)$")) {
                return "redirect:/register?error=" + encode("avatar only supports jpg/png/gif/webp");
            }
            // Validate size (20MB)
            if (avatar.getSize() > 20 * 1024 * 1024) {
                return "redirect:/register?error=" + encode("avatar size exceeds 20MB");
            }
            // Save to disk
            try {
                String fileName = UUID.randomUUID().toString() + suffix;
                File saveDir = new File("src/main/webapp/uploads/avatars/");
                if (!saveDir.exists()) saveDir.mkdirs();
                avatar.transferTo(new File(saveDir, fileName));
                avatarPath = "/uploads/avatars/" + fileName;
            } catch (IOException e) {
                return "redirect:/register?error=" + encode("avatar upload failed");
            }
        }

        User user = new User();
        user.setUsername(username);
        user.setPassword(password);
        user.setNickname(nickname);
        user.setIntro(intro);
        user.setAvatar(avatarPath);

        int result = userService.register(user);

        if (result == -1) {
            return "redirect:/register?error=" + encode("invalid registration info");
        }
        if (result == 0) {
            return "redirect:/register?error=" + encode("username already taken");
        }

        return "redirect:/login?success=" + encode("register success, please login");
    }

    // ==================== Logout ====================

    @GetMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate();
        return "redirect:/login";
    }

    // ==================== Profile ====================

    @GetMapping("/profile")
    public String profilePage(HttpSession session) {
        User loginUser = (User) session.getAttribute("loginUser");
        if (loginUser == null) {
            return "redirect:/login?error=" + encode("please login first");
        }
        return "forward:/static/index.html";
    }

    // ==================== Admin: Destinations ====================

    @GetMapping("/admin/destinations")
    public String adminDestinationsPage(HttpSession session) {
        if (!isAdmin(session)) {
            return "redirect:/login?error=" + encode("admin only");
        }
        return "forward:/static/index.html";
    }

    // ==================== Admin: Tags ====================

    @GetMapping("/admin/tags")
    public String adminTagsPage(HttpSession session) {
        if (!isAdmin(session)) {
            return "redirect:/login?error=" + encode("admin only");
        }
        return "forward:/static/index.html";
    }

    // ==================== Admin: catch-all ====================

    @GetMapping("/admin/**")
    public String adminCatchAll(HttpSession session) {
        if (!isAdmin(session)) {
            return "redirect:/login?error=" + encode("admin only");
        }
        return "forward:/static/index.html";
    }

    // ==================== SPA fallback ====================

    @RequestMapping({
        "/{segment:^(?!api$)(?!static$)[^\\.]+}",
        "/{segment:^(?!api$)(?!static$)[^\\.]+}/**"
    })
    public String forwardSpa() {
        return "forward:/static/index.html";
    }

    // ==================== Helpers ====================

    private boolean isAdmin(HttpSession session) {
        User loginUser = (User) session.getAttribute("loginUser");
        return loginUser != null && loginUser.getType() != null && loginUser.getType() == 1;
    }

    private String encode(String value) {
        return URLEncoder.encode(value, StandardCharsets.UTF_8);
    }
}