package com.zust.se.controller;

import com.zust.se.common.PageResult;
import com.zust.se.common.Result;
import com.zust.se.model.Favorite;
import com.zust.se.model.User;
import com.zust.se.service.FavoriteService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/favorite")
public class FavoriteController {

    @Autowired
    private FavoriteService favoriteService;

    /** 收藏游记 */
    @PostMapping("/{postId}")
    public Result<?> favorite(@PathVariable Integer postId,
                               HttpSession session) {
        User loginUser = (User) session.getAttribute("loginUser");
        if (loginUser == null) {
            return Result.error(401, "请先登录");
        }
        int rows = favoriteService.favorite(loginUser.getId(), postId);
        if (rows == 0) {
            return Result.error(400, "已收藏过该游记");
        }
        return Result.success("收藏成功");
    }

    /** 取消收藏 */
    @DeleteMapping("/{postId}")
    public Result<?> unfavorite(@PathVariable Integer postId,
                                 HttpSession session) {
        User loginUser = (User) session.getAttribute("loginUser");
        if (loginUser == null) {
            return Result.error(401, "请先登录");
        }
        favoriteService.unfavorite(loginUser.getId(), postId);
        return Result.success("取消收藏成功");
    }

    /** 检查是否已收藏 */
    @GetMapping("/check/{postId}")
    public Result<Boolean> check(@PathVariable Integer postId,
                                  HttpSession session) {
        User loginUser = (User) session.getAttribute("loginUser");
        if (loginUser == null) {
            return Result.error(401, "请先登录");
        }
        boolean favorited = favoriteService.isFavorited(loginUser.getId(), postId);
        return Result.success(favorited);
    }

    /** 我的收藏列表（分页，联查游记信息） */
    @GetMapping("/list")
    public Result<PageResult<Favorite>> list(@RequestParam(defaultValue = "1") int page,
                                              @RequestParam(defaultValue = "10") int size,
                                              HttpSession session) {
        User loginUser = (User) session.getAttribute("loginUser");
        if (loginUser == null) {
            return Result.error(401, "请先登录");
        }
        PageResult<Favorite> result = favoriteService.listByUserId(loginUser.getId(), page, size);
        return Result.success(result);
    }
}
