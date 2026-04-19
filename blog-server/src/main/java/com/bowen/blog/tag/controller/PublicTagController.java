package com.bowen.blog.tag.controller;

import com.bowen.blog.common.ApiResponse;
import com.bowen.blog.tag.entity.Tag;
import com.bowen.blog.tag.service.TagService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/tags")
public class PublicTagController {

    private final TagService tagService;

    public PublicTagController(TagService tagService) {
        this.tagService = tagService;
    }

    @GetMapping
    public ApiResponse<List<Tag>> list() {
        return ApiResponse.success(tagService.listTags());
    }
}
