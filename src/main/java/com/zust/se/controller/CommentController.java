package com.zust.se.controller;

import com.zust.se.model.Comment;
import com.zust.se.model.User;
import com.zust.se.service.CommentService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/comment")
public class CommentController {

    @Autowired
    private CommentService commentService;

    // ==================== 发表评论 / 回复 ====================

    /**
     * 发表评论（顶级评论或回复）
     * parentId 为 null 或 0 表示顶级评论，否则为回复
     */
    @PostMapping("/publish")
    public Map<String, Object> publish(@RequestBody Comment comment,
                                       HttpSession session) {
        Map<String, Object> result = new HashMap<>();

        User loginUser = (User) session.getAttribute("loginUser");
        if (loginUser == null) {
            result.put("code", 401);
            result.put("msg", "请先登录");
            return result;
        }

        comment.setUserId(loginUser.getId());

        Comment saved = commentService.publish(comment);
        if (saved == null) {
            result.put("code", 400);
            result.put("msg", "评论发表失败，请检查内容");
            return result;
        }

        result.put("code", 200);
        result.put("msg", "发表成功");
        result.put("data", saved);
        return result;
    }

    // ==================== 查看评论列表 ====================

    @GetMapping("/list/{postId}")
    public Map<String, Object> list(@PathVariable Integer postId) {
        Map<String, Object> result = new HashMap<>();

        List<Comment> comments = commentService.listByPostId(postId);
        result.put("code", 200);
        result.put("msg", "查询成功");
        result.put("data", comments);
        return result;
    }

    // ==================== 评论总数 ====================

    @GetMapping("/count/{postId}")
    public Map<String, Object> count(@PathVariable Integer postId) {
        Map<String, Object> result = new HashMap<>();
        int count = commentService.countByPostId(postId);
        result.put("code", 200);
        result.put("msg", "查询成功");
        result.put("data", count);
        return result;
    }

    // ==================== 用户删除评论 ====================

    @DeleteMapping("/delete/{commentId}")
    public Map<String, Object> delete(@PathVariable Integer commentId,
                                      HttpSession session) {
        Map<String, Object> result = new HashMap<>();

        User loginUser = (User) session.getAttribute("loginUser");
        if (loginUser == null) {
            result.put("code", 401);
            result.put("msg", "请先登录");
            return result;
        }

        int rows = commentService.delete(commentId, loginUser.getId());
        if (rows == 0) {
            result.put("code", 403);
            result.put("msg", "删除失败，无权限或评论不存在");
            return result;
        }

        result.put("code", 200);
        result.put("msg", "删除成功");
        return result;
    }

    // ==================== 管理员删除评论 ====================

    @DeleteMapping("/admin/delete/{commentId}")
    public Map<String, Object> adminDelete(@PathVariable Integer commentId,
                                           HttpSession session) {
        Map<String, Object> result = new HashMap<>();

        User loginUser = (User) session.getAttribute("loginUser");
        if (loginUser == null || loginUser.getType() == null || loginUser.getType() != 1) {
            result.put("code", 403);
            result.put("msg", "需要管理员权限");
            return result;
        }

        int rows = commentService.deleteByAdmin(commentId);
        if (rows == 0) {
            result.put("code", 404);
            result.put("msg", "评论不存在");
            return result;
        }

        result.put("code", 200);
        result.put("msg", "删除成功");
        return result;
    }
}