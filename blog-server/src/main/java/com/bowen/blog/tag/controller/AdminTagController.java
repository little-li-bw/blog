package com.bowen.blog.tag.controller;

import com.bowen.blog.common.ApiResponse;
import com.bowen.blog.tag.entity.Tag;
import com.bowen.blog.tag.service.TagService;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/tags")
public class AdminTagController {

    private final TagService tagService;

    public AdminTagController(TagService tagService) {
        this.tagService = tagService;
    }

    @GetMapping
    public ApiResponse<List<Tag>> list() {
        return ApiResponse.success(tagService.listTags());
    }

    @PostMapping
    public ApiResponse<Tag> create(@RequestBody Tag request) {
        return ApiResponse.success(tagService.createTag(request));
    }

    @PutMapping("/{id}")
    public ApiResponse<Tag> update(@PathVariable Long id, @RequestBody Tag request) {
        return ApiResponse.success(tagService.updateTag(id, request));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        tagService.deleteTag(id);
        return ApiResponse.success("Deleted successfully", null);
    }
}
