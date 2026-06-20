package com.zust.se.service;

import com.zust.se.model.Comment;

import java.util.List;

public interface CommentService {

    /**
     * 发表评论（顶级评论或回复）
     * @return 插入后的完整评论对象（含ID）
     */
    Comment publish(Comment comment);

    /**
     * 查看某游记的所有评论（含用户信息、嵌套回复）
     * @param postId 游记ID
     * @return 顶级评论列表，每个评论内嵌 replies
     */
    List<Comment> listByPostId(Integer postId);

    /**
     * 查看某游记的评论总数
     */
    int countByPostId(Integer postId);

    /**
     * 用户删除自己的评论（同时级联删除所有子回复）
     * @param commentId 评论ID
     * @param userId 当前用户ID
     * @return 1=成功, 0=无权限或不存在
     */
    int delete(Integer commentId, Integer userId);

    /**
     * 管理员删除任意评论
     * @param commentId 评论ID
     * @return 1=成功, 0=不存在
     */
    int deleteByAdmin(Integer commentId);

}