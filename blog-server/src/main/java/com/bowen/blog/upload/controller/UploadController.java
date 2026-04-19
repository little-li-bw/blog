package com.bowen.blog.upload.controller;

import com.bowen.blog.common.ApiResponse;
import com.bowen.blog.upload.entity.UploadFile;
import com.bowen.blog.upload.service.UploadService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/admin/upload")
public class UploadController {

    private final UploadService uploadService;

    public UploadController(UploadService uploadService) {
        this.uploadService = uploadService;
    }

    @PostMapping
    public ApiResponse<UploadFile> upload(@RequestParam("file") MultipartFile file) {
        return ApiResponse.success(uploadService.saveFile(file));
    }
}
