package com.zust.se.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileService {

    /** 允许的图片格式 */
    private static final String ALLOWED_SUFFIX = "\\.(jpg|jpeg|png|gif|webp)$";

    /** 单文件最大 20MB */
    private static final long MAX_SIZE = 20 * 1024 * 1024;

    /** 项目根目录下的上传根路径 */
    private static final String UPLOAD_ROOT = "src/main/webapp/uploads/";

    /**
     * 上传文件，返回 web 访问路径
     * @param file   上传的文件
     * @param subDir 子目录，如 "avatars"、"posts"
     * @return web 路径，如 /uploads/avatars/uuid.png
     */
    public String upload(MultipartFile file, String subDir) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IOException("文件不能为空");
        }

        // 校验类型
        String originalName = file.getOriginalFilename();
        String suffix = "";
        if (originalName != null && originalName.contains(".")) {
            suffix = originalName.substring(originalName.lastIndexOf(".")).toLowerCase();
        }
        if (!suffix.matches(ALLOWED_SUFFIX)) {
            throw new IOException("仅支持 jpg/png/gif/webp 格式");
        }

        // 校验大小
        if (file.getSize() > MAX_SIZE) {
            throw new IOException("文件不能超过 20MB");
        }

        // 存盘
        String fileName = UUID.randomUUID().toString() + suffix;
        String realPath = System.getProperty("user.dir") + "/" + UPLOAD_ROOT + subDir + "/";
        File saveDir = new File(realPath);
        if (!saveDir.exists()) {
            saveDir.mkdirs();
        }
        File dest = new File(saveDir, fileName);
        Files.copy(file.getInputStream(), dest.toPath(), StandardCopyOption.REPLACE_EXISTING);

        return "/uploads/" + subDir + "/" + fileName;
    }
}