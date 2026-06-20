package com.zust.se.service.impl;

import com.zust.se.mapper.CommentMapper;
import com.zust.se.model.Comment;
import com.zust.se.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class CommentServiceImpl implements CommentService {

    @Autowired
    private CommentMapper commentMapper;

    // ==================== 发表评论 ====================

    @Override
    @Transactional
    public Comment publish(Comment comment) {
        if (comment == null || comment.getPostId() == null || comment.getUserId() == null
                || isBlank(comment.getContent())) {
            return null;
        }

        if (comment.getContent().length() > 1000) {
            return null;
        }

        comment.setCreateTime(new Date());
        commentMapper.insert(comment);

        // 重新查询带用户信息返回
        return commentMapper.findById(comment.getId());
    }

    // ==================== 查看评论（含嵌套回复） ====================

    @Override
    public List<Comment> listByPostId(Integer postId) {
        if (postId == null) {
            return Collections.emptyList();
        }

        // 一次性查出该游记所有评论（带用户信息）
        List<Comment> allComments = commentMapper.findByPostIdWithUser(postId);
        if (allComments == null || allComments.isEmpty()) {
            return Collections.emptyList();
        }

        // 构建 parentId -> children 映射
        Map<Integer, List<Comment>> childrenMap = allComments.stream()
                .filter(c -> c.getParentId() != null)
                .collect(Collectors.groupingBy(Comment::getParentId));

        // 递归装配子回复
        List<Comment> topLevel = allComments.stream()
                .filter(c -> c.getParentId() == null)
                .collect(Collectors.toList());

        for (Comment comment : topLevel) {
            buildReplies(comment, childrenMap);
        }

        return topLevel;
    }

    private void buildReplies(Comment parent, Map<Integer, List<Comment>> childrenMap) {
        List<Comment> children = childrenMap.get(parent.getId());
        if (children == null) {
            parent.setReplies(Collections.emptyList());
            return;
        }
        for (Comment child : children) {
            buildReplies(child, childrenMap);
        }
        parent.setReplies(children);
    }

    // ==================== 评论总数 ====================

    @Override
    public int countByPostId(Integer postId) {
        if (postId == null) {
            return 0;
        }
        return commentMapper.countByPostId(postId);
    }

    // ==================== 用户删除评论 ====================

    @Override
    @Transactional
    public int delete(Integer commentId, Integer userId) {
        if (commentId == null || userId == null) {
            return 0;
        }

        Comment comment = commentMapper.findById(commentId);
        if (comment == null) {
            return 0;
        }

        if (!comment.getUserId().equals(userId)) {
            return 0;
        }

        cascadeDelete(commentId);
        commentMapper.deleteById(commentId);
        return 1;
    }

    // ==================== 管理员删除评论 ====================

    //1=成功, 0=不存在
    @Override
    @Transactional
    public int deleteByAdmin(Integer commentId) {
        if (commentId == null) {
            return 0;
        }

        Comment comment = commentMapper.findById(commentId);
        if (comment == null) {
            return 0;
        }

        cascadeDelete(commentId);
        commentMapper.deleteById(commentId);
        return 1;
    }

    // ==================== 级联删除子回复 ====================

    private void cascadeDelete(Integer parentId) {
        List<Comment> replies = commentMapper.findRepliesByParentId(parentId);
        if (replies == null || replies.isEmpty()) {
            return;
        }
        for (Comment reply : replies) {
            cascadeDelete(reply.getId());         // 递归删除更深层回复
            commentMapper.deleteById(reply.getId());
        }
    }

    // ==================== 工具方法 ====================

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }
}