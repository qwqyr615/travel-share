package com.zust.se.controller;

import com.zust.se.common.Result;
import com.zust.se.model.Tag;
import com.zust.se.service.TagService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tags")
public class TagController {

    @Autowired
    private TagService tagService;

    /** 全部列表 */
    @GetMapping
    public Result<List<Tag>> list() {
        return Result.success(tagService.getAll());
    }

    /** 新增 */
    @PostMapping
    public Result<?> add(@RequestBody Tag tag) {
        tagService.add(tag);
        return Result.success("添加成功");
    }

    /** 编辑 */
    @PutMapping("/{id}")
    public Result<?> update(@PathVariable Integer id, @RequestBody Tag tag) {
        tag.setId(id);
        tagService.update(tag);
        return Result.success("更新成功");
    }

    /** 删除 */
    @DeleteMapping("/{id}")
    public Result<?> delete(@PathVariable Integer id) {
        tagService.deleteById(id);
        return Result.success("删除成功");
    }
}