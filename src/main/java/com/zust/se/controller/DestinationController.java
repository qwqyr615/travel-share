package com.zust.se.controller;

import com.zust.se.common.Result;
import com.zust.se.model.Destination;
import com.zust.se.service.DestinationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/destinations")
public class DestinationController {

    @Autowired
    private DestinationService destinationService;

    /** 全部列表 */
    @GetMapping
    public Result<List<Destination>> list() {
        return Result.success(destinationService.getAll());
    }

    /** 下拉选项（仅返回 id + name） */
    @GetMapping("/options")
    public Result<List<Destination>> options() {
        return Result.success(destinationService.getAll());
    }

    /** 新增 */
    @PostMapping
    public Result<?> add(@RequestBody Destination destination) {
        destinationService.add(destination);
        return Result.success("添加成功");
    }

    /** 编辑 */
    @PutMapping("/{id}")
    public Result<?> update(@PathVariable Integer id, @RequestBody Destination destination) {
        destination.setId(id);
        destinationService.update(destination);
        return Result.success("更新成功");
    }

    /** 删除 */
    @DeleteMapping("/{id}")
    public Result<?> delete(@PathVariable Integer id) {
        destinationService.deleteById(id);
        return Result.success("删除成功");
    }
}
