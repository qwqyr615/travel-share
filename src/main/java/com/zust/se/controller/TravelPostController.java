package com.zust.se.controller;

import com.zust.se.common.PageResult;
import com.zust.se.common.Result;
import com.zust.se.model.Post;
import com.zust.se.service.TravelPostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/posts")
public class TravelPostController {

    @Autowired
    private TravelPostService travelPostService;

    /** 游记列表（分页 + 多条件搜索） */
    @GetMapping
    public Result<PageResult<Post>> list(@RequestParam(required = false) String keyword,
                                         @RequestParam(required = false) Integer destination_id,
                                         @RequestParam(required = false) Integer tag_id,
                                         @RequestParam(required = false) String status,
                                         @RequestParam(defaultValue = "1") int page,
                                         @RequestParam(defaultValue = "10") int size) {
        return Result.success(travelPostService.findByCondition(keyword, destination_id, tag_id, status, page, size));
    }

    /** 游记详情（浏览量 +1） */
    @GetMapping("/{id}")
    public Result<Post> detail(@PathVariable Integer id) {
        Post post = travelPostService.findById(id);
        if (post == null) {
            return Result.error(404, "游记不存在");
        }
        return Result.success(post);
    }

    /** 发布游记 */
    @PostMapping
    public Result<Integer> create(@RequestBody Post post) {
        int id = travelPostService.add(post, post.getTag_ids());
        return Result.success(id);
    }

    /** 编辑游记 */
    @PutMapping("/{id}")
    public Result<?> update(@PathVariable Integer id, @RequestBody Post post) {
        post.setId(id);
        travelPostService.update(post, post.getTag_ids());
        return Result.success("更新成功");
    }

    /** 删除游记 */
    @DeleteMapping("/{id}")
    public Result<?> delete(@PathVariable Integer id) {
        travelPostService.delete(id);
        return Result.success("删除成功");
    }
}
