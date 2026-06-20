package com.zust.se.controller;

import com.zust.se.common.Result;
import com.zust.se.service.FileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/upload")
public class UploadController {

    @Autowired
    private FileService fileService;

    /** 上传游记封面图，返回图片 URL */
    @PostMapping("/cover")
    public Result<String> uploadCover(@RequestParam("file") MultipartFile file) {
        try {
            String url = fileService.upload(file, "covers");
            return Result.success(url);
        } catch (Exception e) {
            return Result.error(400, e.getMessage());
        }
    }

    /*上传内容图片，返回 URL*/
    @PostMapping("/image")
    public Result<String> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            String url = fileService.upload(file, "images");
            return Result.success(url);
        } catch (Exception e) {
            return Result.error(400, e.getMessage());
        }
    }


    //上传用户头像
    //暂时用不到,头像上传用表单写了
    @PostMapping("/avatar")
    public Result<String> uploadAvatar(@RequestParam("file") MultipartFile file) {
        try {
            String url = fileService.upload(file, "avatars");
            return Result.success(url);
        } catch (Exception e) {
            return Result.error(400, e.getMessage());
        }
    }
}