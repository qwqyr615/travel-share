package com.zust.se.controller;

import com.zust.se.model.Comment;
import com.zust.se.model.User;
import com.zust.se.common.Result;
import com.zust.se.service.CommentService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comment")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @PostMapping("/publish")
    public Result<Comment> publish(@RequestBody Comment comment,
                                   HttpSession session) {
        User loginUser = (User) session.getAttribute("loginUser");
        if (loginUser == null) {
            return Result.error(401, "请先登录");
        }
        comment.setUserId(loginUser.getId());
        Comment saved = commentService.publish(comment);
        if (saved == null) {
            return Result.error(400, "评论发表失败，请检查内容");
        }
        return Result.success(saved);
    }

    @GetMapping("/list/{postId}")
    public Result<List<Comment>> list(@PathVariable Integer postId) {
        List<Comment> comments = commentService.listByPostId(postId);
        return Result.success(comments);
    }

    @GetMapping("/count/{postId}")
    public Result<Integer> count(@PathVariable Integer postId) {
        int count = commentService.countByPostId(postId);
        return Result.success(count);
    }

    @DeleteMapping("/delete/{commentId}")
    public Result<Void> delete(@PathVariable Integer commentId,
                               HttpSession session) {
        User loginUser = (User) session.getAttribute("loginUser");
        if (loginUser == null) {
            return Result.error(401, "请先登录");
        }
        int rows = commentService.delete(commentId, loginUser.getId());
        if (rows == 0) {
            return Result.error(403, "删除失败，无权限或评论不存在");
        }
        return Result.success("删除成功");
    }

    @DeleteMapping("/admin/delete/{commentId}")
    public Result<Void> adminDelete(@PathVariable Integer commentId,
                                    HttpSession session) {
        User loginUser = (User) session.getAttribute("loginUser");
        if (loginUser == null || loginUser.getType() == null || loginUser.getType() != 1) {
            return Result.error(403, "需要管理员权限");
        }
        int rows = commentService.deleteByAdmin(commentId);
        if (rows == 0) {
            return Result.error(404, "评论不存在");
        }
        return Result.success("删除成功");
    }
}